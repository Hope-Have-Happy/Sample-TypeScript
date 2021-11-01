import Redis from 'ioredis';
import { applyPatches } from 'immer';
import { WorkflowClient } from '@temporalio/client';
import { State, counter } from './workflows';
import { Versioned } from './workflows/subscriptions';
import { taskQueue } from './env';

/**
 * @returns the odd elements of a given array
 */
function odds<T>(source: T[]): T[] {
  if (source.length % 2 !== 0) {
    throw new Error('Source should have an even number of elements');
  }

  const numItems = source.length / 2;

  const ret = Array<T>(numItems);
  for (let i = 0; i < numItems; ++i) {
    ret[i] = source[i * 2 + 1];
  }
  return ret;
}

interface PollOptions {
  maxEntries?: number;
  readBlockTimeMs?: number;
}

/**
 * Helper for polling on versioned patches as generated by the subscriptions interceptors.
 */
async function poll(redis: Redis.Redis, workflowId: string, version: number, opts: PollOptions = {}) {
  const { maxEntries, readBlockTimeMs } = opts;

  for (;;) {
    const result = await redis.xread(
      ...(maxEntries ? ['COUNT', maxEntries] : []),
      ...(readBlockTimeMs ? ['BLOCK', readBlockTimeMs] : []),
      'STREAMS',
      workflowId,
      version
    );
    if (result === null) {
      continue;
    }
    const [[_, entries]] = result as Array<[string, Array<[string, string[]]>]>;
    return entries.map(([version, fields]) => ({
      version: parseInt(version, 10),
      patches: odds(fields).map((txt) => JSON.parse(txt)),
    }));
  }
}

export class SubscriptionClient {
  constructor(readonly workflowClient: WorkflowClient) {}

  /**
   * An async iterator that subscribes to Workflow state updates
   */
  async *subscribe<T>(workflowId: string): AsyncIterable<T> {
    // Create a new Redis connection as opposed to reusing a shared one because the xread API blocks.
    const redis = new Redis();
    const handle = this.workflowClient.getHandle(workflowId);
    const resultPromise = handle.result();
    let { version, value } = await handle.query<Versioned<T>>('getValue');
    yield value;
    for (;;) {
      const result = await Promise.race([
        poll(redis, workflowId, version).then((updates) => ({ type: 'updates', updates } as const)),
        resultPromise.then(() => ({ type: 'complete' } as const)),
      ]);
      if (result.type === 'complete') {
        await redis.quit();
        break;
      }
      const { updates } = result;
      version = updates[updates.length - 1].version;
      const patches = updates.flatMap(({ patches }) => patches);
      const updated = applyPatches({ value }, patches);
      value = updated.value;
      yield value;
    }
  }
}

export async function run() {
  const workflowClient = new WorkflowClient();
  const subsClient = new SubscriptionClient(workflowClient);
  const { workflowId } = await workflowClient.start(counter, { taskQueue, args: [0 /* initialValue */] });
  for await (const state of subsClient.subscribe<State>(workflowId)) {
    console.log(state);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

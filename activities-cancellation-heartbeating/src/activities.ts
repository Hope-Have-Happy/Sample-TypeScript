// @@@SNIPSTART typescript-activity-fake-progress
import { Context } from '@temporalio/activity';
import { CancelledFailure } from '@temporalio/common';

export async function fakeProgress(sleepIntervalMs = 1000): Promise<void> {
  try {
    // allow for resuming from heartbeat
    const startingPoint = Context.current().info.heartbeatDetails || 1;
    for (let progress = startingPoint; progress <= 100; ++progress) {
      // simple utility to sleep in activity for given interval or throw if Activity is cancelled
      // don't confuse with Workflow.sleep which is only used in Workflow functions!
      await Context.current().sleep(sleepIntervalMs);
      Context.current().heartbeat(progress);
    }
  } catch (err) {
    if (err instanceof CancelledFailure) {
      console.log('Fake progress activity cancelled');
      // Cleanup
    }
    throw err;
  }
}
// @@@SNIPEND

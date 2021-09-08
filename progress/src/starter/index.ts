import { Connection, WorkflowClient } from '@temporalio/client';
import { Progress } from '../interfaces/workflows';

async function run() {
  const connection = new Connection();
  const client = new WorkflowClient(connection.service);

  const progress = client.stub<Progress>('progress', { taskQueue: 'tutorial' });

  await progress.start();

  const val = await progress.query.getProgress();
  // Should print "10", may print another number depending on timing
  console.log(val);

  const result = await progress.result();
  console.log(result); // 100
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

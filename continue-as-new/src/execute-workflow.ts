import { Connection, WorkflowClient } from '@temporalio/client';
import { loopingWorkflow } from './workflows';

async function run() {
  // Connect to localhost with default ConnectionOptions,
  // pass options to the Connection constructor to configure TLS and other settings.
  const connection = new Connection();
  // Workflows will be started in the "default" namespace unless specified otherwise
  // via options passed the WorkflowClient constructor.
  const client = new WorkflowClient(connection.service);
  // Create a typed handle for the example Workflow.
  const result = await client.execute(loopingWorkflow, { taskQueue: 'tutorial' });
  console.log(result); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

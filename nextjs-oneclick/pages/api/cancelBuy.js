import { Connection, WorkflowClient } from '@temporalio/client';

export default async function cancelBuy(req, res) {
  const { id } = req.query
  if (!id) {
    res.status(405).send({ message: 'must send workflow id to cancel' })
    return
  }

  const connection = new Connection();
  const client = new WorkflowClient(connection.service);
  const workflow = client.createWorkflowHandle(id);
  await workflow.signal.cancelPurchase('user cancelled')
  res.status(200).json({ cancelled: id })
}

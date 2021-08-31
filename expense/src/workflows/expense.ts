import { createExpense } from '@activities/createExpense';
import { payment } from '@activities/payment' ;
import { Trigger, sleep } from '@temporalio/workflow';

type ExpenseStatus = 'CREATED' | 'APPROVED' | 'REJECTED' | 'TIMED_OUT' | 'COMPLETED';
let status: expenseStatus = 'CREATED';

const signalTrigger = new Trigger<void>();
const timeoutMS = 10000;

const signals = {
  approve() {
    status = 'APPROVED';
    signalTrigger.resolve();
  },
  reject() {
    status = 'REJECTED';
    signalTrigger.resolve();
  }
}

async function main(expenseId: string): Promise<{ status: string }> {
  await createExpense(expenseId);

  if (status === 'CREATED') {
    await Promise.race([signalTrigger, sleep(timeoutMS)]);
  }

  if (status === 'APPROVED') {
    await payment(expenseId);
    status = 'COMPLETED';
  }
  return { status };

  return { status };
}
exports.workflow = { main, signals };
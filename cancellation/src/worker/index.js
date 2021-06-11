'use strict';

const { Worker } = require('@temporalio/worker');

run().catch(err => console.log(err));

async function run() {
  const worker = await Worker.create({
    workDir: __dirname,
    taskQueue: 'tutorial25'
  });
  await worker.run();
};
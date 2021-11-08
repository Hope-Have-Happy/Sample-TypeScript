# samples-typescript

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Samples](#samples)
  - [Basic](#basic)
  - [API demos](#api-demos)
    - [Activity APIs and Design Patterns](#activity-apis-and-design-patterns)
    - [Workflow APIs](#workflow-apis)
    - [Production APIs](#production-apis)
    - [Advanced APIs](#advanced-apis)
  - [Apps](#apps)
- [Contributing](#contributing)
  - [Config files](#config-files)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Samples

Each directory in this repo is a sample Temporal project built with the [TypeScript SDK](https://docs.temporal.io/docs/typescript/introduction/).

To start a project based on one of these samples, run:

```sh
npx @temporalio/create@latest my-project-name
```

### Basic

- [**Basic hello world**](./hello-world): Simple example of a Workflow Definition and an Activity Definition.
  - Variant: [Basic hello world with mTLS](./hello-world-mtls) shows how to connect to your Temporal Cloud namespace with mTLS authentication.
- [**Pure ES Modules**](./fetch-esm): Configure Temporal with TypeScript and Pure ESM.

### API demos

#### Activity APIs and Design Patterns

- [**Activities Examples**](./activities-examples):
  - `makeHTTPRequest`: Make an external HTTP request in an Activity (using `axios`)
  - `cancellableFetch`: Make a cancellable HTTP request with [`cancellationSignal`](https://typescript.temporal.io/api/classes/activity.context/#cancellationsignal).
- [**Activity Cancellation and Heartbeating**](./activities-cancellation-heartbeating): Heartbeat progress for long running activities and cancel them.
- [**Dependency Injection**](./activities-dependency-injection): Share dependencies between activities (for example, when you need to initialize a database connection once and then pass it to multiple activities).
- [**Sticky Activities**](./activities-sticky-queues): Dynamically assign task queue names to ensure activities execute sequentially on the same machine (eg for CI/CD, file processing workflows).

#### Workflow APIs

- **Timers**:
  - The [**progress example**](./timer-progress) demonstrates how to use the `sleep` function from `@temporalio/workflow`.
  - [**Timer Examples**](./timer-examples):
    - Send a notification to the customer if their order is taking longer than expected (using a `Promise.race` between the order activity and `sleep`).
    - Create an `UpdatableTimer` that can be slept on, and at the same time, have its duration updated via Signals.
- **Signals and Triggers**:
  - The [**Signals and Queries example**](./signals-queries) demonstrates the usage of Signals, Queries, and Workflow Cancellation.
  - **Async activity completion**: Example of an [**Expense reporting**](./expense) Workflow that communicates with a server API. Shows how to kick off a Workflow and manually complete it at an arbitrarily later date.
- [**Cron Workflows**](./cron-workflows): Schedule a cron job.
- [**Child Workflows**](./child-workflows): Start and control Child Workflows.
- [**Infinite Workflows**](./continue-as-new): Use the `continueAsNew` API for indefinitely long running Workflows.
- [**Search Attributes**](./search-attributes): Set up Search Attributes (an experimental feature for now).

#### Production APIs

- [**Production**](./production): Build code in advance for faster Worker startup times.
- [**Patching**](https://docs.temporal.io/docs/typescript/patching/): Patch in new Workflow code when making updates to Workflows that have executions in progress in production.

#### Advanced APIs

- Interceptors
  - [**OpenTelemetry**](./interceptors-opentelemetry): Use the Interceptors feature to add OpenTelemetry metrics reporting to your workflows. ⚠️ This sample is broken for now.
  - [**Query Subscriptions**](./query-subscriptions): Use Redis Streams, Immer, and SDK Interceptors to subscribe to Workflow state.

### Apps

- **Next.js**:
  - [**One-click e-commerce**](./nextjs-ecommerce-oneclick): Buy an item with one click, and the Workflow will wait 5 seconds to see if the user cancels before it executes the order.
  - Food Delivery: https://github.com/lorensr/food-delivery
- E-commerce example: https://github.com/vkarpov15/temporal-ecommerce-ts
- XState example: https://github.com/Devessier/temporal-electronic-signature

## Contributing

External contributions are very welcome! 🤗 (Big thank you to those who have [already contributed](https://github.com/temporalio/samples-typescript/graphs/contributors) 🙏)

Before submitting a major PR, please find consensus on it in [Issues](https://github.com/temporalio/samples-typescript/issues).

To start, run these commands in the root directory:

```bash
npm install
npm run prepare
npm run bootstrap
```

Prettier and ESLint are run on each commit, but you can also run them manually:

```sh
npm run format
npm run lint
```

### Config files

Also on each commit, config files from [`.shared/`](./.shared) are copied into each sample directory, overwriting the sample directory's config files (with a few exceptions listed in [`.scripts/copy-shared-files.mjs`](./.scripts/copy-shared-files.mjs)). So if you're editing config files, you usually want to be editing the versions in `.shared/`.

The [`.post-create`](./.shared/.post-create) file is a [chalk template](https://github.com/chalk/chalk-cli#template-syntax) that is displayed in the command line after someone uses [`npx @temporalio/create`](https://docs.temporal.io/docs/typescript/package-initializer). If you're adding a sample that requires different instructions from the default message, then add your sample name to [`POST_CREATE_EXCLUDE`](./.scripts/copy-shared-files.mjs) and your message template to `your-sample/.post-create`.

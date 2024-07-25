# OpenTelemetry Node.js distro for Uptrace

<a href="https://github.com/uptrace/uptrace-js" target="_blank">
  <img src="/devicon/nodejs-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry JavaScript SDK for Node.js to export spans and metrics to Uptrace using OTLP/HTTP.

To learn about OpenTelemetry API, see [OpenTelemetry JS Tracing API](https://uptrace.dev/opentelemetry/js-tracing.html) and [OpenTelemetry JS Metrics API](https://uptrace.dev/opentelemetry/js-metrics.html).

[[toc]]

## Uptrace Node.js

[uptrace-js](https://github.com/uptrace/uptrace-js) is a thin wrapper over [opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

To install `@uptrace/node`:

```shell
# npm
npm install @uptrace/node --save

# yarn
yarn add @uptrace/node --save
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

<!-- prettier-ignore -->
::: warning
You must call `configureOpentelemetry` as early as possible and before importing other packages, because OpenTelemetry SDK must patch libraries before you import them.
:::

```js:no-v-pre
// The very first import must be Uptrace/OpenTelemetry.
const uptrace = require('@uptrace/node')
const otel = require('@opentelemetry/api')

// Start OpenTelemetry SDK and invoke instrumentations to patch the code.
uptrace.configureOpentelemetry({
  // copy your project DSN here or use UPTRACE_DSN env var
  //dsn: '{{ dsn }}',
  serviceName: 'myservice',
  serviceVersion: '1.0.0',
  deploymentEnvironment: 'production',
})

// Other imports. Express is monkey-patched at this point.
const express = require('express')

// Create a tracer.
const tracer = otel.trace.getTracer('app_or_package_name')

// Start the app.
const app = express()
app.listen(3000)
```

To avoid potential issues, it is **strongly recommended** to put the OpenTelemetry initialization code into a separate file called `otel.js` and use the `--require` flag to load the tracing code before the application code:

```shell
# JavaScript
node --require ./otel.js app.js

# TypeScript
ts-node --require ./otel.ts app.ts
```

If you are using AWS Lambda, you need to set the `NODE_OPTIONS` environment variable:

```shell
export NODE_OPTIONS="--require otel.js"
```

See [express-pg](https://github.com/uptrace/uptrace-js/tree/master/example/express-pg) for a working example.

### Automatic instrumentation

Whenever you load a module, OpenTelemetry automatically checks if there a matching instrumentation plugin and uses it to patch the original package.

You can also register instrumentations manually:

```js:no-v-pre
const uptrace = require('@uptrace/node')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg')

uptrace.configureOpentelemetry({
  // Set dsn or UPTRACE_DSN env var.
  dsn: '{{ dsn }}',

  serviceName: 'myservice',
  serviceVersion: '1.0.0',

  instrumentations: [new PgInstrumentation(), new HttpInstrumentation()],
})
```

### Configuration options

!!!include(js-config.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 1**. Install [@uptrace/node](https://github.com/uptrace/uptrace-js):

```shell
# npm
npm install @uptrace/node --save

# yarn
yarn add @uptrace/node --save
```

- **Step 2**. Copy the [code](https://github.com/uptrace/uptrace-js/tree/master/example/basic-node) to `main.js` replacing the `<dsn>`:

<ProjectPicker v-model="activeProject" :projects="projects" />

```js:no-v-pre
'use strict'

// The very first import must be Uptrace/OpenTelemetry.
const otel = require('@opentelemetry/api')
const uptrace = require('@uptrace/node')

// Start OpenTelemetry SDK and invoke instrumentations to patch the code.
uptrace.configureOpentelemetry({
  // Set dsn or UPTRACE_DSN env var.
  //dsn: '{{ dsn }}',
  serviceName: 'myservice',
  serviceVersion: '1.0.0',
})

// Create a tracer. Usually, tracer is a global variable.
const tracer = otel.trace.getTracer('app_or_package_name', '1.0.0')

// Create a root span (a trace) to measure some operation.
tracer.startActiveSpan('main-operation', (main) => {
  tracer.startActiveSpan('GET /posts/:id', (child1) => {
    child1.setAttribute('http.method', 'GET')
    child1.setAttribute('http.route', '/posts/:id')
    child1.setAttribute('http.url', 'http://localhost:8080/posts/123')
    child1.setAttribute('http.status_code', 200)
    child1.recordException(new Error('error1'))
    child1.end()
  })

  tracer.startActiveSpan('SELECT', (child2) => {
    child2.setAttribute('db.system', 'mysql')
    child2.setAttribute('db.statement', 'SELECT * FROM posts LIMIT 100')
    child2.end()
  })

  // End the span when the operation we are measuring is done.
  main.end()

  console.log(uptrace.traceUrl(main))
})

setTimeout(async () => {
  // Send buffered spans and free resources.
  await uptrace.shutdown()
})
```

- **Step 3**. Run the [example](https://github.com/uptrace/uptrace-js/tree/master/example/basic-node) to get a link for the generated trace:

```shell
node main.js
https://uptrace.dev/traces/<trace_id>
```

- **Step 4**. Follow the link to view the trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-js/tree/master/example/otlp-traces) is how you can export traces to Uptrace following the recommendations above:

```js
'use strict'

const otel = require('@opentelemetry/api')
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { Resource } = require('@opentelemetry/resources')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray')

const dsn = process.env.UPTRACE_DSN
console.log('using dsn:', dsn)

const exporter = new OTLPTraceExporter({
  url: 'https://otlp.uptrace.dev/v1/traces',
  headers: { 'uptrace-dsn': dsn },
  compression: 'gzip',
})
const bsp = new BatchSpanProcessor(exporter, {
  maxExportBatchSize: 1000,
  maxQueueSize: 1000,
})

const sdk = new NodeSDK({
  spanProcessor: bsp,
  resource: new Resource({
    'service.name': 'myservice',
    'service.version': '1.0.0',
  }),
  idGenerator: new AWSXRayIdGenerator(),
})
sdk.start()

const tracer = otel.trace.getTracer('app_or_package_name', '1.0.0')

tracer.startActiveSpan('main', (main) => {
  main.end()
  console.log('trace id:', main.spanContext().traceId)
})

// Send buffered spans.
setTimeout(async () => {
  await sdk.shutdown()
}, 1000)
```

### Exporting metrics

[Here](https://github.com/uptrace/uptrace-js/tree/master/example/otlp-metrics) is how you can export metrics to Uptrace following the recommendations above:

```js
'use strict'

const otel = require('@opentelemetry/api')
const { Resource } = require('@opentelemetry/resources')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http')
const { PeriodicExportingMetricReader, AggregationTemporality } = require('@opentelemetry/sdk-metrics')

const dsn = process.env.UPTRACE_DSN
console.log('using dsn:', dsn)

const exporter = new OTLPMetricExporter({
  url: 'https://otlp.uptrace.dev/v1/metrics',
  headers: { 'uptrace-dsn': dsn },
  compression: 'gzip',
  temporalityPreference: AggregationTemporality.DELTA,
})
const metricReader = new PeriodicExportingMetricReader({
  exporter: exporter,
  exportIntervalMillis: 15000,
})

const sdk = new NodeSDK({
  metricReader: metricReader,
  resource: new Resource({
    'service.name': 'myservice',
    'service.version': '1.0.0',
  }),
})
sdk.start()

const meter = otel.metrics.getMeter('app_or_package_name', '1.0.0')

const requestCounter = meter.createCounter('requests', {
  description: 'Example of a counter',
})

setInterval(() => {
  requestCounter.add(1, { environment: 'staging' })
}, 1000)
```

### Exporting logs

[Here](https://github.com/uptrace/uptrace-js/tree/master/example/otlp-logs) is how you can export traces to Uptrace following the recommendations above:

```js
const { SeverityNumber } = require('@opentelemetry/api-logs')
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const { CompressionAlgorithm } = require('@opentelemetry/otlp-exporter-base')

const dsn = process.env.UPTRACE_DSN
console.log('using dsn:', dsn)

const loggerExporter = new OTLPLogExporter({
  url: `https://otlp.uptrace.dev/v1/logs`,
  headers: { 'uptrace-dsn': dsn },
  compression: CompressionAlgorithm.GZIP,
})
const loggerProvider = new LoggerProvider()

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(loggerExporter))

const logger = loggerProvider.getLogger('app_or_package_name', '1.0.0')
logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'info',
  body: 'this is a log body',
  attributes: { 'log.type': 'custom' },
})

loggerProvider.shutdown().catch(console.error)
```

## Node.js runtime metrics

To collect Node.js runtime metrics, install `opentelemetry-node-metrics`:

```shell
# npm
npm install opentelemetry-node-metrics --save

# yarm
yarn add opentelemetry-node-metrics --save
```

Then start collecting metrics like this:

```js
const otel = require('@opentelemetry/api')
const uptrace = require('@uptrace/node')
const startNodeMetrics = require('opentelemetry-node-metrics')

uptrace.configureOpentelemetry({...})

// Must be called AFTER OpenTelemetry is configured.
const meterProvider = otel.metrics.getMeterProvider()
startNodeMetrics(meterProvider)
```

## Troubleshooting

!!!include(js-troubleshooting.md)!!!

## What's next?

!!!include(next-node.md)!!!

- [OpenTelemetry Express.js](instrument/opentelemetry-express.md)

<script type="ts">
import { defineComponent  } from 'vue'

import { useProjectPicker } from '@/use/org'

export default defineComponent({
  setup() {
    const { projects, activeProject, dsn } = useProjectPicker()
    return { projects, activeProject, dsn }
  },
})
</script>

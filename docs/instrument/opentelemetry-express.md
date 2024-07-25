---
title: OpenTelemetry Express.js instrumentation
description: Use OpenTelemetry instrumentation to monitor and optimize Express.js performance.
keywords:
  - opentelemetry express
  - opentelemetry express instrumentation
---

# Monitor Express.js with OpenTelemetry

![OpenTelemetry Express](/cover/opentelemetry-express.png)

By combining OpenTelemetry with Express.js, you can collect and export telemetry data, including traces, metrics, and logs, to gain insight into the behavior and performance of your application.

[[toc]]

## What is Express.js?

Express.js is a fast and minimalist web application framework for Node.js, a JavaScript runtime. It simplifies the development of web applications and APIs by providing a robust set of features and utilities, while maintaining a lightweight and unobtrusive approach.

Express.js is widely recognized for its simplicity, flexibility, and extensibility, making it a popular choice for building server-side applications in Node.js.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-2.md)!!!

## Express.js instrumentation

Using the OpenTelemetry Node.js library, you can easily add distributed tracing capabilities to your Express.js applications.

To instrument an Express.js app, you need to install OpenTelemetry Node.js SDK and available instrumentations:

```shell
# Using npm
npm install @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/auto-instrumentations-node

# Using yarn
yarn add @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

You can let OpenTelemetry to instrument your application automatically or do it explicitly by installing required instrumentations:

```shell
# Using npm
npm install @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express

# Using yarn
yarn add @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express
```

## Usage

After installing OpenTelemetry, you need to configure OpenTelemetry SDK to export data to an [OpenTelemetry backend](https://uptrace.dev/blog/opentelemetry-backend.html) for strorage and visualization.

```js
'use strict'

const otel = require('@opentelemetry/api')
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { Resource } = require('@opentelemetry/resources')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')

const dsn = process.env.UPTRACE_DSN
console.log('using dsn:', dsn)

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:14318/v1/traces',
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
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
})
sdk.start()
```

To avoid potential issues, it is **strongly recommended** to put the OpenTelemetry initialization code into a separate file called `otel.js` and use the `--require` flag to load the tracing code before the application code:

```shell
# JavaScript
node --require ./otel.js app.js

# TypeScript
ts-node --require ./otel.ts app.ts
```

See [OpenTelemetry Express.js example](https://github.com/uptrace/uptrace-js/tree/master/example/express) for details.

## Uptrace

!!!include(what-is-uptrace-6.md)!!!

## What's next?

By integrating OpenTelemetry with Express.js, you can gain insight into your application's [distributed traces](https://uptrace.dev/opentelemetry/distributed-tracing.html), [OpenTelemetry metrics](https://uptrace.dev/opentelemetry/metrics.html), and [logs](https://uptrace.dev/opentelemetry/logs.html). This helps you understand the behavior of your Express.js application across multiple services or microservices, and facilitates troubleshooting and performance optimization.

!!!include(next-node.md)!!!

- [OpenTelemetry Django](opentelemetry-django.md)
- [OpenTelemetry Falcon](opentelemetry-falcon.md)

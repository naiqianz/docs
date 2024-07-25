---
title: 'Forever free OpenTelemetry APM [traces logs metrics]'
description: Uptrace is a forever free OpenTelemetry APM with open code that supports traces, metrics, and logs.
keywords:
  - opentelemetry apm
  - opentelemetry application performance monitoring
  - opentelemetry application performance management
---

# Uptrace: OpenTelemetry APM at scale

OpenTelemetry APM (Application Performance Monitoring) is a tool that helps developers and DevOps teams to monitor applications performance using OpenTelemetry observability framework.

Uptrace is a [source available](https://github.com/uptrace/uptrace) OpenTelemetry APM built from the ground up to fully follow OpenTelemetry specification and guidelines.

![OpenTelemetry APM](/uptrace/cover.png)

[[toc]]

## What is OpenTelemetry?

OpenTelemetry is an open source project that provides a unified and vendor-neutral observability data format and APIs for modern cloud-native applications.

OpenTelemetry defines APIs and protocols for collecting telemetry data such as [OpenTelemetry traces](https://uptrace.dev/opentelemetry/distributed-tracing.html), [OpenTelemetry metrics](https://uptrace.dev/opentelemetry/metrics.html), and logs. You can Use OpenTelemetry to instrument your code and capture distributed traces and metrics. OpenTelemetry provides libraries for various programming languages and frameworks.

OpenTelemetry enables developers to better understand behavior of their applications and diagnose performance issues more easily.

## How Uptrace works?

Uptrace stores telemetry data in a ClickHouse database. ClickHouse is an open source column-oriented database management system that is designed to process large volumes of data in real-time and to provide fast analytics and reporting capabilities.

!!!include(how-uptrace-works.md)!!!

Uptrace allows you to correlate distributed traces with metrics and logs, providing a complete view of your application's behavior.

## Why Uptrace?

- Single UI for traces, metrics, and logs.
- Efficient ingestion: more than 10K spans / second on a single core.
- Excellent on-disk compression with ZSTD, for example, 1KB span can be compressed down to <40 bytes.
- S3 storage support with ability to automatically upload cold data to S3-like storage or HDD.
- Automatic alerts with notifications via email, Slack, Telegram, and more.

## Best-in-class OpenTelemetry

Uptrace is fully compatible with OpenTelemetry and natively supports OpenTelemetry protocol (OTLP) either via gRPC (OTLP/gRPC) or HTTP (OTLP/HTTP) transports.

You can send OpenTelemetry data to Uptrace with these options:

- [OpenTelemetry SDK](get-started.md)
- [OpenTelemetry Collector](ingest/collector.md)

Uptrace provides pre-configured OpenTelemetry SDKs for [Go](opentelemetry-go.md), [Python](opentelemetry-python.md), [JavaScript](opentelemetry-js-node.md), [Ruby](opentelemetry-ruby.md), [Java](opentelemetry-java.md), and [PHP](opentelemetry-php.md).

## All-in-one APM

Uptrace is an all-in-one Application Performance Management (APM) tool that provides a single integrated user interface for traces, metrics, and logs. It helps identify performance bottlenecks in applications, such as slow database queries or unoptimized code.

Trace analysis provides a visual representation of how requests flow through the application, including how long each component takes to complete.

Uptrace's log management capabilities help to centralize, search, and analyze log data from different parts of the application.

Uptrace includes alerting features that can notify you when performance metrics exceed predefined thresholds or when anomalies are detected.

!!!include(uptrace-screenshots.md)!!!

## OpenTelemetry Demo

In less than 5 minutes, you try Uptrace with OpenTelemetry Astronomy Shop [demo app](https://github.com/uptrace/uptrace/tree/master/example/opentelemetry-demo), a microservice-based distributed system intended to illustrate the implementation of OpenTelemetry in a near real-world environment.

**Step 1**. Download the opentelemetry-demo using Git:

```shell
git clone https://github.com/uptrace/opentelemetry-demo.git
cd opentelemetry-demo
```

**Step 2**. Start the demo:

```shell
docker compose up --no-build
```

**Step 3**. Make sure Uptrace is running:

```shell
docker-compose logs uptrace
```

**Step 4**. Open Uptrace UI at [http://localhost:14318/overview/2](http://localhost:14318/overview/2)

If something is not working, check OpenTelemetry Collector logs:

```shell
docker-compose logs otelcol
```

## Instrumentations

[OpenTelemetry Instrumentations](instrument/README.md) are plugins for popular frameworks and libraries that use OpenTelemetry API to record important operations, for example, HTTP requests, DB queries, logs, errors, and more.

You can check the following tutorials to get started with the most popular frameworks:

- [OpenTelemetry Gin](instrument/opentelemetry-gin.md)
- [OpenTelemetry Django](instrument/opentelemetry-django.md)
- [OpenTelemetry Flask](instrument/opentelemetry-flask.md)
- [OpenTelemetry Rails](instrument/opentelemetry-rails.md)
- [OpenTelemetry Express.js](instrument/opentelemetry-express.md)

## What's next?

In just a few minutes, you can try Uptrace by visiting the [cloud demo](https://app.uptrace.dev/play) (no login required) or running it locally with [Docker](https://github.com/uptrace/uptrace/tree/master/example/docker). The source code is available on [GitHub](https://github.com/uptrace/uptrace).

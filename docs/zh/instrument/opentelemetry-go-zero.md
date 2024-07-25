---
title: OpenTelemetry Go-Zero monitoring [otelzero]
description: OpenTelemetry helps Go-Zero developers instrument, generate, collect, and export telemetry data from their applications.
keywords:
  - opentelemetry go zero
  - otel go zero
---

<CoverImage title="Monitor Go-Zero performance with OpenTelemetry" />

By integrating OpenTelemetry into your Go-Zero application, you can gain insights into its performance, troubleshoot issues, and analyze its behavior in real-time or post-analysis using the supported monitoring and observability tools.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-4.md)!!!

## What is Go-Zero?

Go-Zero is an open-source microservices framework for Go programming language. It is designed to simplify the development of high-performance, scalable, and reliable microservices.

## Usage

You can instrument your Go-Zero application by enabling OpenTelemetry instrumentation to capture relevant telemetry data, such as traces and metrics.

To start monitoring your Go-Zero application, add the following lines to the YAML config. If you don't have an Uptrace DSN, you can learn how to obtain one [here](../get-started.md#dsn).

```yaml
Telemetry:
  Name: api-api
  Endpoint: localhost:14317
  Sampler: 1.0
  Batcher: otlpgrpc
  OtlpHeaders:
    uptrace-dsn: http://project2_secret_token@localhost:14318?grpc=14317
```

You can also find a Docker example on [GitHub](https://github.com/uptrace/uptrace/tree/master/example/go-zero).

## What is Uptrace?

!!!include(what-is-uptrace-1.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Express.js](opentelemetry-express.md)
- [OpenTelemetry Django](opentelemetry-django.md)

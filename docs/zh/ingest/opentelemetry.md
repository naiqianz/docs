---
title: Ingesting telemetry using OpenTelemetry Distros for Uptrace
---

# Ingesting telemetry using OpenTelemetry Distros for Uptrace

![Ingest OpenTelemetry SDK](/cover/ingest-opentelemetry.png)

Uptrace uses OpenTelemetry protocol (OTLP) to receive telemetry data such as [traces](https://uptrace.dev/opentelemetry/distributed-tracing.html#spans), [metrics](https://uptrace.dev/opentelemetry/metrics.html), and [logs](https://uptrace.dev/opentelemetry/logs.html). Uptrace supports both OTLP/gRPC and OTLP/HTTP.

To start sending data to Uptrace, you need to configure OpenTelemetry SDK for your programming language using an Uptrace DSN.

Uptrace DSN (Data Source Name) is a connection string that is used to connect and send data to an Uptrace backend. It contains a backend address (host:port) and a secret token that grants access to a project.

You can find your project DSN on the Project Settings page:

![Uptrace DSN](/uptrace/dsn.png)

Once you have a DSN, follow instructions for your programming language:

!!!include(devicons-uptrace-distro.md)!!!

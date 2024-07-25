---
title: OpenTelemetry PostgreSQL Monitoring
description: Monitor your PostgreSQL database using OpenTelemetry Collector postgres receiver.
keywords:
  - opentelemetry postgresql
  - opentelemetry postgresql monitoring
  - postgresql monitoring
---

# Monitoring PostgreSQL Performance using OpenTelemetry

![OpenTelemetry PostgreSQL](/opentelemetry-postgresql/cover.png)

Monitoring PostgreSQL is essential to ensure the optimal performance, availability, and reliability of your PostgreSQL database.

This tutorial explains how you can use OpenTelemetry and Uptrace to monitor PostgreSQL performance, establish baseline metrics, and proactively address performance issues to ensure the optimal operation of your PostgreSQL database.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-1.md)!!!

## OpenTelemetry PostgreSQL receiver

Using OpenTelemetry Collector, you can monitor essential performance metrics provided by PostgreSQL, such as CPU usage, memory consumption, disk I/O, and network traffic.

To start monitoring PostgreSQL with Otel Collector, you need to configure PostgreSQL receiver in `/etc/otel-contrib-collector/config.yaml` using [Uptrace DSN](../get-started.md#dsn):

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  postgresql:
    endpoint: localhost:5432
    transport: tcp
    username: otel
    password: $POSTGRESQL_PASSWORD
    databases:
      - otel
    collection_interval: 10s
    tls:
      insecure: true

exporters:
  otlp:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '<FIXME>' }

processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp, postgresql]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp]
```

Don't forget to restart the service:

```shell
sudo systemctl restart otelcol-contrib
```

You can also check OpenTelemetry Collector logs for any errors:

```shell
sudo journalctl -u otelcol-contrib -f
```

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-2.md)!!!

## Available metrics

Uptrace automatically creates the following dashboard when PostgreSQL metrics are available:

![PostgreSQL metrics](/opentelemetry-postgresql/metrics.png)

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Redis](opentelemetry-redis.md)
- [OpenTelemetry Docker](opentelemetry-docker.md)

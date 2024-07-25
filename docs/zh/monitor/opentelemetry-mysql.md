---
title: OpenTelemetry MySQL Monitoring [step by step]
description: Monitor your MySQL database using OpenTelemetry Collector mysql receiver.
keywords:
  - opentelemetry mysql
  - opentelemetry mysql monitoring
  - opentelemetry mysql receiver
  - mysql monitoring
---

# Monitoring MySQL Performance using OpenTelemetry

![OpenTelemetry MySQL](/opentelemetry-mysql/cover.png)

Monitoring MySQL performance is crucial to ensure the optimal operation of your MySQL database and identify any potential bottlenecks or issues.

This tutorial explains how you can use OpenTelemetry and Uptrace to proactively identify and address performance issues, optimize your MySQL database, and ensure its smooth operation.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-1.md)!!!

## OpenTelemetry MySQL receiver

Using OpenTelemetry Collector, you can monitor key performance metrics provided by MySQL itself, such as CPU usage, memory utilization, disk I/O, network traffic, and query throughput.

To start monitoring MySQL, you need to configure [MySQL receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/mysqlreceiver) in `/etc/otel-contrib-collector/config.yaml` using [Uptrace DSN](../get-started.md#dsn):

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  mysql:
    endpoint: localhost:3306
    username: otel
    password: $MYSQL_PASSWORD
    database: otel
    collection_interval: 10s
    perf_events_statements:
      digest_text_limit: 120
      time_limit: 24h
      limit: 250

exporters:
  otlp/uptrace:
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
      exporters: [otlp/uptrace]
    metrics:
      receivers: [otlp, mysql]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp/uptrace]
```

Don't forget to restart OpenTelemetry Collector:

```shell
sudo systemctl restart otelcol-contrib
```

You can also check OpenTelemetry Collector logs for any errors:

```shell
sudo journalctl -u otelcol-contrib -f
```

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-4.md)!!!

## Available metrics

Uptrace automatically creates the following dashboard when MySQL metrics are available:

![MySQL metrics](/opentelemetry-mysql/metrics.png)

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry PHP-FPM](opentelemetry-php-fpm.md)
- [OpenTelemetry PostgreSQL](opentelemetry-postgresql.md)

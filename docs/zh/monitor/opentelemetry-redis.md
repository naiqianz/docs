---
title: OpenTelemetry Redis Monitoring
description: Monitor your Redis cluster performance for free using Uptrace and OpenTelemetry Collector receiver.
keywords:
  - opentelemetry redis
  - opentelemetry redis monitoring
---

# Monitoring Redis Performance using OpenTelemetry

![OpenTelemetry Redis](/opentelemetry-redis/cover.png)

[Monitoring Redis](https://uptrace.dev/blog/redis-monitoring.html) performance is crucial to ensure optimal operation and identify any potential bottlenecks or issues.

To monitor Redis performance, you can use OpenTelemetry Collector to collect metrics and Uptrace to visualize them..

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-3.md)!!!

## OpenTelemetry Redis receiver

To start monitoring Redis with Otel Collector, you need to configure Redis [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/redisreceiver/README.md) in `/etc/otel-contrib-collector/config.yaml` using [Uptrace DSN](../get-started.md#dsn):

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  redis:
    endpoint: localhost:6379
    collection_interval: 10s

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
      receivers: [otlp, redis]
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

Redis receiver provides [configuration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/redisreceiver/README.md#configuration) options to collect specific metrics, enable or disable tracing, define sampling rates for traces, and configure log collection settings.

By utilizing the OpenTelemetry Redis receiver, you can capture and collect telemetry data from Redis, enabling you to gain insights into the performance, behavior, and usage patterns of your Redis instances. This data can be invaluable for monitoring, troubleshooting, and optimizing the performance of your Redis infrastructure.

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-4.md)!!!

## Available metrics

When telemetry data reaches Uptrace, it automatically generates a Redis dashboard from a pre-defined template.

![Redis metrics](/opentelemetry-redis/metrics.png)

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Docker](opentelemetry-docker.md)
- [OpenTelemetry Kafka](opentelemetry-kafka.md)

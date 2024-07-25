---
title: OpenTelemetry Kafka Monitoring
description: Monitor your Kafka database using OpenTelemetry Collector receiver.
keywords:
  - opentelemetry kafka
  - opentelemetry kafka metrics
  - opentelemetry kafka receiver
  - opentelemetry kafka instrumentation
---

# Monitor Kafka with OpenTelemetry

![OpenTelemetry Kafka](/opentelemetry-kafka/cover.png)

Apache Kafka is a widely used distributed streaming platform known for its high throughput, fault tolerance, and scalability.

Using the OpenTelemetry Collector Kafka receiver, you can collect telemetry data from Kafka applications and send it to your observability backend for analysis and visualization.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-2.md)!!!

With OpenTelemetr Collectory, you can collect telemetry data from your Kafka clusters and send it to the [OpenTelemetry backend](https://uptrace.dev/blog/opentelemetry-backend.html) of your choice. This allows you to gain insight into the behavior and performance of your Kafka messaging system, monitor message processing times, track message flows, and analyze the overall health of your Kafka-based applications.

## OpenTelemetry Kafka receiver

Monitoring Apache Kafka is critical to ensuring the health, performance, and reliability of your Kafka cluster.

Monitoring Kafka metrics helps identify performance bottlenecks, resource utilization issues, and potential inefficiencies within your Kafka cluster. By tracking metrics such as CPU usage, disk utilization, network traffic, and message rates, you can optimize your Kafka deployment to ensure optimal performance and scalability.

To start monitoring Kafka, you need to configure [Kafka receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/kafkametricsreceiver) in `/etc/otel-contrib-collector/config.yaml` using [Uptrace DSN](../get-started.md#dsn):

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  kafkametrics:
    brokers: localhost:9092
    protocol_version: 2.0.0
    scrapers:
      - brokers
      - topics
      - consumers

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

!!!include(what-is-uptrace-5.md)!!!

## What's next?

By monitoring Kafka metrics, you can detect problems and anomalies early and take proactive measures before they escalate. By tracking metrics such as partition lag, replication lag, and consumer lag, you can identify and address potential bottlenecks, slow consumers, or replication delays.

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Kubernetes](opentelemetry-kubernetes.md)
- [OpenTelemetry MySQL](opentelemetry-mysql.md)

---
title: 'Uptrace: Open Source APM [Forever Free]'
description: Uptrace is an open source application performance monitoring tool that can help you monitor and analyze performance of your applications.
keywords:
  - open source apm
  - apm open source
  - open source apm tool
  - opensource apm
  - open source server monitoring
  - open source server monitoring software
  - monitoring snmp open source
  - uptime monitoring open source
  - open source application performance monitoring
  - open source system monitoring
  - system monitoring software open source
  - open source website monitoring
  - open source monitoring tools
date: 2024-07-20
---

# Uptrace: Open Source Application Performance Monitoring (APM)

Uptrace is an open source application performance monitoring tool that supports distributed tracing, metrics, and logs. You can use it to monitor applications and set up automatic alerts to receive notifications via email, Slack, Telegram, and more.

![Open Source APM](/uptrace/cover.png)

[[toc]]

## Open Source

Uptrace is an open source application performance monitoring (APM) tool that supports [OpenTelemetry tracing](https://uptrace.dev/opentelemetry/distributed-tracing.html), [metrics](https://uptrace.dev/opentelemetry/metrics.html), and [logs](https://uptrace.dev/opentelemetry/logs.html). You can use it to monitor applications and set up alerts to receive notifications via email, Slack, Telegram, and more.

Uptrace is licensed under the AGPL license, which is the same license used by Grafana. It collects and analyzes data from various sources, such as servers, databases, cloud providers, monitoring tools, and custom applications, making it a good solution for open source system monitoring.

Uptrace provides a unified view of the entire technology stack, enabling you to monitor the performance, availability, and health of your systems in real time.

!!!include(uptrace-screenshots.md)!!!

## What is OpenTelemetry?

Uptrace uses [OpenTelemetry](https://uptrace.dev/opentelemetry/) to instrument code and collect traces, metrics, and logs. OpenTelemetry specifies how to collect and export telemetry data. With OpenTelemetry, you can instrument your application once and then add or change vendors without changing the instrumentation.

OpenTelemetry is available for most programming languages and provides interoperability across different languages and environments, making it a key component of open source application performance monitoring.

## How Uptrace works?

Uptrace uses OpenTelemetry protocol to receive telemetry data directly from your application or from [OpenTelemetry Collector](ingest/collector.html).

Uptrace efficiently stores the data in ClickHouse database which, when compared with Elasticsearch or Cassandra, allows to significantly reduce storage requirements and improve query performance.

Uptrace has built-in alerting capabilities and can send notifications via email, Slack, Telegram, and more, making it ideal for uptime monitoring open source.

!!!include(how-uptrace-works.md)!!!

Uptrace comes with a modern Vue-based UI that helps you analyze and optimize application performance using a fast and intuitive query language.

## Why Uptrace?

- Single UI for traces, metrics, and logs.
- SQL-like query language to [aggregate spans](querying-spans.md).
- Promql-like language to [aggregate metrics](querying-metrics.md).
- Built-in [alerts](alerting.md) with notifications via Email, Slack, WebHook, and AlertManager.
- Pre-built metrics dashboards.
- Multiple users/projects via YAML config.
- Single sign-on (SSO): [Keycloak](sso/keycloak.md), [Cloudflare](sso/cloudflare.md), [Google Cloud](sso/google.md), and others.
- Ingestion using [OpenTelemetry](ingest/opentelemetry.md), [Vector](ingest/vector.md), [FluentBit](ingest/fluent-bit.md), [CloudWatch](ingest/aws-cloudwatch.md), and more.
- Efficient processing: more than 10K spans / second on a single core.
- Excellent on-disk compression: 1KB span can be compressed down to ~40 bytes.

## Why ClickHouse?

ClickHouse excels at real-time analysis, making it ideal for APM systems that require immediate insight into application performance metrics.

ClickHouse is highly efficient at compressing data, making it an ideal choice for storing large volumes of trace data that can grow rapidly. This results in significant cost savings for storage.

ClickHouse is an open source database, which means there are no licensing costs. Its efficient storage and query capabilities make it a cost-effective storage solution for APM tools.

## Why PostgreSQL?

PostgreSQL is a full-featured RDBMS with strong support for ACID (Atomicity, Consistency, Isolation, Durability) transactions. When used used unique indexes, transactions ensure data integrity by enforcing uniqueness constraints on specified columns within a table.

Since ClickHouse does not support transactions and unique indexes, Uptrace uses a PostgreSQL database to store metadata such as projects, users, alerts, and notifications.

The PostgreSQL database used by Uptrace is quite small and typically takes up only a few megabytes of disk space. So you don't have to worry about its performance or scalability.

## Why not ...?

There are many [distributed tracing tools](https://uptrace.dev/blog/distributed-tracing-tools.html) available on the market and each of them offers varying features, integrations, and pricing models.

The choice of an [OpenTelemetry backend](https://uptrace.dev/blog/opentelemetry-backend.html) may depend on specific requirements, technology stack, and preferences of the organization or individual, but here are some open source APM projects that are both interesting and inspiring.

| Feature           | Uptrace            | [SkyWalking](#skywalking) | [Signoz](#signoz)  | [Jaeger](#jaeger)  | [Grafana](#grafana) |
| ----------------- | ------------------ | ------------------------- | ------------------ | ------------------ | ------------------- |
| Traces            | :heavy_check_mark: | :heavy_check_mark:        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  |
| Metrics           | :heavy_check_mark: | :heavy_check_mark:        | :heavy_check_mark: | :x:                | :heavy_check_mark:  |
| Logs              | :heavy_check_mark: | :heavy_check_mark:        | :heavy_check_mark: | :x:                | :heavy_check_mark:  |
| OpenTelemetry     | :heavy_check_mark: | Adapter                   | :heavy_check_mark: | :heavy_check_mark: | Adapter             |
| Storage           | Clickhouse         | BanyanDB                  | ClickHouse         | ClickHouse         | Custom              |
| Pluggable storage | :x:                | :heavy_check_mark:        | :x:                | :heavy_check_mark: | :heavy_check_mark:  |
| S3 storage        | :heavy_check_mark: | :x:                       | :heavy_check_mark: | :x:                | :x:                 |
| Alerting          | :heavy_check_mark: | :heavy_check_mark:        | AlertManager       | :x:                | :heavy_check_mark:  |
| Cloud version     | :heavy_check_mark: | :x:                       | :heavy_check_mark: | :x:                | :heavy_check_mark:  |
| License           | AGPL               | Apache                    | Apache+EE          | Apache             | AGPL                |
| Demo              | [link][1]          | [link][2]                 |                    |                    | [link][3]           |

[1]: https://app.uptrace.dev/play
[2]: http://demo.skywalking.apache.org/
[3]: https://play.grafana.org/

### SkyWalking

[SkyWalking](https://skywalking.apache.org/) is an open source distributed tracing system designed to monitor and diagnose complex microservices-based architectures. It is an Apache project.

SkyWalking is often used in cloud-native and microservices-based architectures to gain visibility into application performance and troubleshoot issues.

The SkyWalking storage is pluggable so you can use BanyanDB or ElasticSearch to store traces, metrics, and logs. Uptrace uses ClickHouse database which is more mature than BanyanDB and more efficient than ElasticSearch.

SkyWalking does not directly support OpenTelemetry protocol and instead provides an OpenTelemetry adapter.

SkyWalking has an official [demo](http://demo.skywalking.apache.org/) (skywalking:skywalking) so you can easily compare it with the [Uptrace demo](https://app.uptrace.dev/play) yourself.

### Signoz

Signoz is an emerging tool in the observability space that provides distributed tracing capabilities to improve monitoring and troubleshooting in microservices architectures.

- Both projects use Go, OpenTelemetry, and ClickHouse.
- Both projects support all 3 major observability signals: traces, metrics, and logs.
- Uptrace uses the AGPL license. Signoz uses dual licensing: Apache 2.0 and Enterprise License.
- Uptrace has built-in alerting capabilities, but Signoz uses AlertManager for notifications.
- Uptrace provides span grouping and optimizes ClickHouse schema for filtering and analyzing similar spans. Signoz uses a more service-oriented DB schema design.
- Uptrace provides preconfigured OpenTelemetry distributions, but Signoz provides instructions on how to configure OpenTelemetry SDKs.

### Jaeger

[Jaeger](https://jaegertracing.io/) is an open-source end-to-end distributed tracing system. It is designed to monitor and troubleshoot complex microservices-based architectures.

Jaeger is widely adopted in the cloud-native community and is used to monitor and diagnose complex microservices architectures.

Jaeger has a plugin to store data in ClickHouse, but it abstracts storage access which allows to support multiple backends at small performance cost.

Jaeger does not support metrics, charts, percentiles, and has limited filtering capabilities.

See [Jaeger vs OpenTelemetry](https://uptrace.dev/blog/jaeger-vs-opentelemetry.html) to learn how projects can be used together.

### Grafana

Grafana is an open-source analytics and monitoring platform for various types of data. It allows you to query, visualize, alert on, and understand your metrics no matter where they are stored. It is primarily used for visualizing time-series data for infrastructure and application analytics, but many use it in other domains including industrial sensors, home automation, weather, and process control.

Grafana provides a highly customizable dashboard and supports a wide range of data sources, including Prometheus, InfluxDB, Graphite, Elasticsearch, and many others, making it a versatile tool for open source system monitoring and open source server monitoring.

Grafana Tempo is an open-source tracing solution focused on high scalability and interoperability with other tracing protocols. Tempo can be used as a backend for OpenTelemetry, Zipkin, and Jaeger tracing data. However, Grafana Tempo lacks some advanced trace analysis features, which makes Uptrace a better choice for those who need a comprehensive open source application performance monitoring solution.

Grafana is widely adopted due to its flexibility and integration capabilities, making it a powerful tool for open source website monitoring and system monitoring software open source.

You may be also interested in:

- [Top 10 Best Monitoring Tools for IT Infrastructure in 2024](https://uptrace.dev/blog/monitoring-tools-for-it.html)

## What's next?

Next, [get started](get-started.md) with Uptrace by downloading the Uptrace binary or creating a cloud account.

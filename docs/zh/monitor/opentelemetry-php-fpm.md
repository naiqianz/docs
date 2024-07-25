---
title: OpenTelemetry PHP FPM metrics
description: Learn how to monitor PHP FPM metrics with OpenTelemetry and Uptrace.
keywords:
  - opentelemetry php fpm
  - opentelemetry php fpm metrics
  - opentelemetry php fpm exporter
---

# Monitoring PHP FPM using OpenTelemetry

![OpenTelemetry PHP FPM](/opentelemetry-php-fpm/cover.png)

To monitor PHP FPM performance, you can use OpenTelemetry Collector to collect metrics and Uptrace to visualize them.

It works like this:

- PHP-FPM exporter provides a Prometheus endpoint with metrics.
- OpenTelemetry Collector scrapes the PHP-FPM Prometheus endpoint and exports data to Uptrace.
- Uptrace stores and visualizes the metrics it receives from OpenTelemetry Collector.

[[toc]]

## PHP-FPM exporter

[PHP-FPM Exporter](https://github.com/hipages/php-fpm_exporter) is a Prometheus exporter that allows you to scrape PHP-FPM metrics using Prometheus or OpenTelemetry Collector.

PHP-FPM Exporter collects metrics such as request counts, response times, memory usage, and various other performance-related data from PHP-FPM. These metrics can then be visualized, monitored, and used for alerting in Uptrace.

To retrieve information from PHP-FPM running on `127.0.0.1:9000` with status endpoint being `/status`:

```shell
php-fpm_exporter get --phpfpm.scrape-uri tcp://127.0.0.1:9000/status
```

See [php-fpm_exporter](https://github.com/hipages/php-fpm_exporter) documentation for more details.

## What is OpenTelemetry Collector?

!!!include(collector-metrics-2.md)!!!

## Scraping PHP FPM metrics

To start monitoring PHP-FPM with OpenTelemetry, you need to configure OpenTelemetry Collector to scrape the PHP-FPM exporter endpoint.

Here is the OpenTelemetry Collector config from [php-fpm](https://github.com/uptrace/uptrace-php/tree/master/example/php-fpm) Docker example:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  prometheus/phpfpm:
    config:
      scrape_configs:
        - job_name: php-fpm
          static_configs:
            - targets: [php-fpm-exporter:9253]

exporters:
  otlp/uptrace:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '${UPTRACE_DSN}' }

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
      receivers: [otlp, prometheus/phpfpm]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp/uptrace]
  telemetry:
    logs:
      level: 'debug'
```

Next, use Uptrace or [Grafana Alternatives](https://uptrace.dev/blog/grafana-alternatives.html) to create dashboards and graphs based on the PHP-FPM metrics collected by OpenTelemetry Collector.

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-7.md)!!!

## What's next?

By setting up the PHP-FPM Exporter and integrating it with Uptrace, you can gain insights into the performance and health of your PHP-FPM instances and make informed decisions regarding optimizations or troubleshooting.

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry PostgreSQL](opentelemetry-postgresql.md)
- [OpenTelemetry Redis](opentelemetry-redis.md)

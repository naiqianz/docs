# OpenTelemetry HTTPcheck Receiver

![OpenTelemetry httpcheck](/httpcheck/cover.png)

HTTP Check Receiver is a component of the OpenTelemetry Collector that can be used to perform synthetic checks against HTTP endpoints.

It allows you to monitor the availability and performance of HTTP endpoints by making a request to the specified endpoint.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-1.md)!!!

## OpenTelemetry httpcheck receiver

HTTP Check [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/httpcheckreceiver) is a component of the OpenTelemetry Collector that enables synthetic checks against HTTP endpoints to monitor their availability and performance.

The receiver makes a request to the specified `endpoint` using the configured `method`, for example, here is how you can monitor Uptrace availability:

```yaml
receivers:
  httpcheck:
    targets:
      - endpoint: 'https://api.uptrace.dev/health/status'
        method: GET
    collection_interval: 15s

exporters:
  otlp:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '<FIXME>' }

service:
  pipelines:
    metrics:
      receivers: [httpcheck]
      processors: [batch]
      exporters: [otlp]
```

You can use this receiver in conjunction with the OpenTelemetry Collector [Health Check](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/extension/healthcheckextension) Extension, which provides an HTTP URL that can be probed to check the status of the OpenTelemetry Collector:

```yaml
extensions:
  health_check:

receivers:
  httpcheck:
    targets:
      - endpoint: 'http://localhost:13133/health/status'
        method: GET
    collection_interval: 15s
```

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-1.md)!!!

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Kafka](opentelemetry-kafka.md)
- [OpenTelemetry Kubernetes](opentelemetry-kubernetes.md)

---
title: Ingesting spans from Jaeger [using OpenTelemetry]
---

<CoverImage title="Ingesting spans from Jaeger using OpenTelemetry" />

You can receive spans from Jaeger using the corresponding OpenTelemetry Collector receiver and then export the data to Uptrace using the OpenTelemetry protocol.

[[toc]]

## OpenTelemetry Collector

!!!include(what-is-collector-1.md)!!!

## Jaeger receiver

Jaeger Agent is a component that is responsible for receiving spans from the instrumented application and forwarding it to a collector, so that data gets appropriately stored.

To receive data from Jaeger Agent, you need to configure [jaeger](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/jaegerreceiver) receiver in the OpenTelemetry Collector:

```yaml
receivers:
  jaeger:
    protocols:
      # listens on :14250
      grpc:

exporters:
  # export data to Uptrace
  otlp/uptrace:
    endpoint: localhost:14317
    tls:
      insecure: true
    headers: { 'uptrace-dsn': 'http://project2_secret_token@localhost:14318?grpc=14317' }

processors:
  batch:
    send_batch_size: 10000
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp, jaeger]
      processors: [batch]
      exporters: [otlp/uptrace]
```

## Jaeger Agent and HotRod

Once OpenTelemetry Collector is ready to accept data, you need to provide Jaeger Agent the port on which the Collector is listening:

```yaml
services:
  jaeger-agent:
    image: jaegertracing/jaeger-agent:latest
    command: ['--reporter.grpc.host-port=localhost:14250']
    network_mode: host
```

Then make sure your app is sending data to the Jaeger Agent, for example, using Hot Rod application:

```yaml
services:
  jaeger-hot-rod:
    image: jaegertracing/example-hotrod:latest
    command: ['all']
    network_mode: host
    environment:
      - JAEGER_AGENT_HOST=localhost
      - JAEGER_AGENT_PORT=6831
    depends_on:
      - jaeger-agent
```

## Example

See [Docker](https://github.com/uptrace/uptrace/tree/master/example/docker) example which demonstrates how to use Uptrace, OpenTelemetry Collector, and Jaeger Agent together.

## OpenTelemetry

[Jaeger and OpenTelemetry](https://uptrace.dev/blog/jaeger-vs-opentelemetry.html) are complementary technologies. Jaeger is a specialized distributed tracing system, while OpenTelemetry is a broader observability framework that includes tracing, metrics, and logging.

So while Jaeger focuses specifically on distributed tracing, OpenTelemetry provides a more comprehensive approach to observability by including tracing, metrics, and logging.

You can use Jaeger as the default [OpenTelemetry backend](https://uptrace.dev/blog/opentelemetry-backend.html) when using OpenTelemetry to collect telemetry from your applications.

- [Jaeger vs Prometheus](https://uptrace.dev/blog/jaeger-vs-prometheus.html)

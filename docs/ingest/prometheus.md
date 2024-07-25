---
title: Ingesting Prometheus metrics into Uptrace
---

# Ingesting Prometheus metrics into Uptrace

![Ingest Prometheus metrics](/cover/ingest-prometheus.png)

There are 2 ways to ingest Prometheus metrics into Uptrace:

- Using Prometheus Remote Write with the Uptrace endpoint.
- Using the OpenTelemetry Collector Prometheus receiver and the OTLP exporter.

[[toc]]

## Prometheus remote write

<!-- prettier-ignore -->
::: tip
Prometheus remote write is recommended over OTLP when using Uptrace as a [Grafana](../grafana.md) data source.
:::

Prometheus Remote Write allows Prometheus to send its collected metrics data to a long-term storage solution such as Uptrace.

You can configure Prometheus Remote Write using the following endpoint:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```yaml:no-v-pre
remote_write:
  - url: 'https://api.uptrace.dev/api/v1/prometheus/write'
    headers: { 'uptrace-dsn': '{{ dsn }}' }
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```yaml
remote_write:
  - url: 'http://localhost:14318/api/v1/prometheus/write'
    headers: { 'uptrace-dsn': 'http://project2_secret_token@localhost:14318?grpc=14317' }
```

  </CodeGroupItem>
</CodeGroup>

## OpenTelemetry Collector

!!!include(what-is-collector-2.md)!!!

### Prometheus receiver

Prometheus uses a pull model for data collection. In a pull-based model, Prometheus acts as a client, actively retrieving metrics from the targets (servers, applications, or other data sources) it monitors.

You can use OpenTelemetry Collector instead of Prometheus to pull metrics using the [prometheus_simple](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/simpleprometheusreceiver) receiver:

```yaml
receivers:
  prometheus_simple:
    collection_interval: 10s
    endpoint: '172.17.0.5:9153'
    metrics_path: '/metrics'
    use_service_account: false
    tls:
      ca_file: '/path/to/ca'
      cert_file: '/path/to/cert'
      key_file: '/path/to/key'
      insecure_skip_verify: true
```

And then export the metrics to Uptrace using OpenTelemetry protocol:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```yaml:no-v-pre
exporters:
  otlp:
    endpoint: https://otlp.uptrace.dev:4317
    headers:
      headers: { 'uptrace-dsn': '{{ dsn }}' }

service:
  pipelines:
    metrics:
      receivers: [prometheus_simple]
      exporters: [otlp]
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```yaml
exporters:
  otlp:
    endpoint: http://localhost:14317
    headers:
      headers: { 'uptrace-dsn': 'http://project2_secret_token@localhost:14318?grpc=14317' }

service:
  pipelines:
    metrics:
      receivers: [prometheus_simple]
      exporters: [otlp]
```

  </CodeGroupItem>
</CodeGroup>

See [OpenTelemetry Prometheus Metrics](https://uptrace.dev/opentelemetry/prometheus-metrics.html) for details.

<script type="ts">
import { defineComponent  } from 'vue'

import { useProjectPicker } from '@/use/org'

export default defineComponent({
  setup() {
    const { projects, activeProject, dsn } = useProjectPicker()
    return { projects, activeProject, dsn }
  },
})
</script>

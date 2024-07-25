---
title: Ingesting logs using Grafana Loki push API
---

<CoverImage title="Ingesting logs using Grafana Loki push API" />

You can receive logs from Grafana Agent or Promtail using the OpenTelemetry Collector Loki receiver and then export the data to Uptrace using the OpenTelemetry protocol.

[[toc]]

## OpenTelemetry Collector

!!!include(what-is-collector-2.md)!!!

## Loki receiver

The Loki [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/lokireceiver) implements the [Loki push api](https://grafana.com/docs/loki/latest/clients/promtail/#loki-push-api) as specified [here](https://grafana.com/docs/loki/latest/api/#push-log-entries-to-loki). It allows Promtail instances to specify the Open telemetry Collector as their `lokiAddress`.

To receive logs from Promtail and export them to Uptrace, add the following to your OpenTelemetry Collector configuration file:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```yaml:no-v-pre
receivers:
  loki:
    protocols:
      http:
      grpc:
    use_incoming_timestamp: true

exporters:
  otlp/uptrace:
    endpoint: otlp.uptrace.dev:4317
    headers:
      uptrace-dsn: '{{ dsn }}'

processors:
  batch:

service:
  pipelines:
    logs:
      receivers: [loki]
      processors: [batch]
      exporters: [otlp/uptrace]
```

  </CodeGroupItem>

  <CodeGroupItem title="Self-hosted">

```yaml
receivers:
  loki:
    protocols:
      http:
      grpc:
    use_incoming_timestamp: true

exporters:
  otlp/uptrace:
    endpoint: http://localhost:14317
    tls:
      insecure: true
    headers:
      uptrace-dsn: 'http://project2_secret_token@localhost:14318?grpc=14317'

service:
  pipelines:
    logs:
      receivers: [loki]
      processors: [batch]
      exporters: [otlp/uptrace]
```

  </CodeGroupItem>
</CodeGroup>

You can then configure Promtail to export data to OpenTelemetry Collector:

```yaml
clients:
  - url: http://otelcol:3500/loki/api/v1/push
```

- [OpenTelemetry Logs](https://uptrace.dev/opentelemetry/logs.html)
- [Structured logging](https://uptrace.dev/blog/structured-logging.html)

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

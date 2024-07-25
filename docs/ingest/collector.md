---
title: Ingesting telemetry using OpenTelemetry Collector
---

# Ingesting telemetry using OpenTelemetry Collector

![Ingest Collector](/cover/ingest-collector.png)

!!!include(what-is-collector-1.md)!!!

Out of the box, Uptrace accepts data from OpenTelemetry Collector using OTLP and automatically creates [dashboards](/querying-metrics.md#dashboards) for the available metrics.

[[toc]]

## Sending data from Collector to Uptrace

If you are already using [OpenTelemetry Collector](https://uptrace.dev/opentelemetry/collector.html), you can configure it to send data to Uptrace using OpenTelemetry Protocol (OTLP).

<!-- prettier-ignore -->
::: tip
Don't forget to add Uptrace exporter to `service.pipelines` section. Unused receivers and exporters are silently ignored.
:::

### Cloud

To send data to [Uptrace Cloud](https://uptrace.dev/):

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="gRPC">

```yaml:no-v-pre
processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    send_batch_size: 10000
    timeout: 10s

exporters:
  otlp/uptrace:
    endpoint: otlp.uptrace.dev:4317
    headers:
      uptrace-dsn: '{{ dsn }}'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/uptrace]
    metrics:
      receivers: [otlp]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp/uptrace]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/uptrace]
```

  </CodeGroupItem>

  <CodeGroupItem title="HTTP">

```yaml:no-v-pre
processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    send_batch_size: 10000
    timeout: 10s

exporters:
  otlphttp/uptrace:
    endpoint: https://otlp.uptrace.dev
    headers:
      uptrace-dsn: '{{ dsn }}'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/uptrace]
    metrics:
      receivers: [otlp]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlphttp/uptrace]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/uptrace]
```

  </CodeGroupItem>
</CodeGroup>

### Self-hosted

To send data to a self-hosted Uptrace installation that does not have TLS:

<CodeGroup>
  <CodeGroupItem title="gRPC">

```yaml:no-v-pre
processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    send_batch_size: 10000
    timeout: 10s

exporters:
  otlp/uptrace:
    endpoint: http://localhost:14317
    tls:
      insecure: true
    headers:
      uptrace-dsn: 'http://project2_secret_token@localhost:14318?grpc=14317'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/uptrace]
    metrics:
      receivers: [otlp]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp/uptrace]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/uptrace]
```

  </CodeGroupItem>

  <CodeGroupItem title="HTTP">

```yaml:no-v-pre
processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    send_batch_size: 10000
    timeout: 10s

exporters:
  otlphttp/uptrace:
    endpoint: http://localhost:14318
    tls:
      insecure: true
    headers:
      uptrace-dsn: 'http://project2_secret_token@localhost:14318?grpc=14317'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/uptrace]
    metrics:
      receivers: [otlp]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlphttp/uptrace]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/uptrace]
```

  </CodeGroupItem>
</CodeGroup>

### Debugging issues

If otelcol is not working as expected, you can check the log output for potential issues. The logging verbosity level defaults to `INFO`, but you can change it using the configuration file:

```yaml
service:
  telemetry:
    logs:
      level: 'debug'
```

## Sending data from Uptrace distros to Collector

Sometimes it might be useful to send data from Uptrace distros to an OpenTelemetry Collector acting as a middle-man that forwards the received data to Uptrace.

For example, you can use OpenTelemetry Collector in such a manner for [tail-based sampling](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor) or [redacting](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/redactionprocessor) span attributes.

Assuming your local OpenTelemetry Collector is listening on `localhost:4317` (OTLP/gRPC) and `localhost:4318` (OTLP/HTTP), use the following Uptrace DSN to configure Uptrace distros:

```shell
# For distros that use OTLP/gRPC exporter.
UPTRACE_DSN=http://localhost:4317

# or

# For distros that use OTLP/HTTP exporter.
UPTRACE_DSN=http://localhost:4318
```

If the Collector supports TLS, replace `http` with `https`.

## Host metrics

`hostmetricsreceiver` is an OpenTelemetry Collector plugin that gathers various metrics about the host system, for example, CPU, RAM, disk metrics and other system-level metrics.

See [OpenTelemetry Host Metrics receiver](https://uptrace.dev/opentelemetry/collector-host-metrics.html) for details.

## Dashboards

Once everything is configured properly, Uptrace will automatically create dashboards using pre-built [templates](https://github.com/uptrace/uptrace/tree/master/config/dashboard-templates):

![Dashboard](/host-metrics/metrics.png)

## What's next?

Next, learn more about [OpenTelemetry Collector](https://uptrace.dev/opentelemetry/collector.html) or browse available [receivers](https://uptrace.dev/opentelemetry/collector-config.html).

- [OpenTelemetry Kubernetes](../monitor/opentelemetry-kubernetes.md)
- [OpenTelemetry Docker](../monitor/opentelemetry-docker.md)
- [OpenTelemetry Redis](../monitor/opentelemetry-redis.md)
- [OpenTelemetry PostgreSQL](../monitor/opentelemetry-postgresql.md)
- [OpenTelemetry MySQL](../monitor/opentelemetry-mysql.md)
- [OpenTelemetry Kafka](../monitor/opentelemetry-kafka.md)
- [OpenTelemetry PHP-FPM](../monitor/opentelemetry-php-fpm.md)

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

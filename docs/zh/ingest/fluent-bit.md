---
title: Sending FluentBit logs to Uptrace
---

# Sending FluentBit logs to Uptrace

![Ingest FluentBit](/cover/ingest-fluentbit.png)

[FluentBit](https://fluentbit.io/) is an open-source and multi-platform log processor and forwarder that allows you to collect data/logs from different sources, unify and filter them, and send them to multiple destinations.

## Configuration

To configure FluentBit to send logs to Uptrace, use the OpenTelemetry output and pass your project DSN via HTTP headers.

For example, to collect syslog messages, you can create the following FluentBit config:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
[SERVICE]
    Flush         3
    Log_level     info
    Parsers_File  /etc/fluent-bit/parsers.conf

[INPUT]
    Name         Tail
    Path         /var/log/syslog
    Path_Key     log_file
    DB           /run/fluent-bit-messages.state
    Parser       syslog-rfc3164

[OUTPUT]
    Name                 opentelemetry
    Match                *
    Host                 otlp.uptrace.dev
    Port                 443
    Header               uptrace-dsn {{ dsn }}
    Compress             gzip
    Metrics_uri          /v1/metrics
    Logs_uri             /v1/logs
    Traces_uri           /v1/traces
    Log_response_payload True
    Tls                  On
    Tls.verify           Off
    # add user-defined labels
    add_label            service.name myservice
    add_label            log.source fluent-bit
```

  </CodeGroupItem>

  <CodeGroupItem title="Self-hosted">

```toml
[SERVICE]
    Flush         3
    Log_level     info
    Parsers_File  /etc/fluent-bit/parsers.conf

[INPUT]
    Name         Tail
    Path         /var/log/syslog
    Path_Key     log_file
    DB           /run/fluent-bit-messages.state
    Parser       syslog-rfc3164

[OUTPUT]
    Name                 opentelemetry
    Match                *
    Host                 localhost
    Port                 14318
    Header               uptrace-dsn http://project2_secret_token@localhost:14318?grpc=14317
    Compress             gzip
    Metrics_uri          /v1/metrics
    Logs_uri             /v1/logs
    Traces_uri           /v1/traces
    Log_response_payload True
    Tls                  Off
    Tls.verify           Off
    # add user-defined labels
    add_label            service.name myservice
    add_label            log.source fluent-bit
```

  </CodeGroupItem>
</CodeGroup>

Copy the config above to `fluent-bit.conf` and then start FluentBit:

```shell
fluent-bit -c fluent-bit.conf
```

## See also

- [Vector Logs](vector.md)
- [Monitoring Logs](../logging.md)
- [Structured Logging](https://uptrace.dev/blog/structured-logging.html)
- [OpenTelemetry Logs](https://uptrace.dev/opentelemetry/logs.html)

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

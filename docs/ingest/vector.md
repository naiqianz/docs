---
title: Using Vector to ingest logs into Uptrace
---

# Using Vector to ingest logs into Uptrace

![Ingest Vector Logs](/cover/ingest-vector.png)

[Vector](https://vector.dev/docs/setup/installation/) collects, transforms, and sends your logs to multiple destinations including Uptrace. It is blazingly fast and memory efficient.

[[toc]]

## Configuration

To configure Vector to send logs to Uptrace, use the [HTTP sink](https://vector.dev/docs/reference/configuration/sinks/http/) and pass your project [DSN](../get-started.md#dsn) via HTTP headers.

For example, to collect syslog messages, you can create the following Vector config:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```toml:no-v-pre
[sources.syslog]
type = "file"
include = ["/var/log/syslog"]

[transforms.parse_syslog]
type = "remap"
inputs = ["syslog"]
source = '''
. = parse_syslog!(string!(.message))
'''

[sinks.uptrace]
type = "http"
method = "post"
inputs = ["parse_syslog"]
encoding.codec = "json"
framing.method = "newline_delimited"
compression = "gzip"
request.headers.uptrace-dsn = "{{ dsn }}"
uri = "https://api.uptrace.dev/api/v1/vector/logs"
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```toml
[sources.syslog]
type = "file"
include = ["/var/log/syslog"]

[transforms.parse_syslog]
type = "remap"
inputs = ["syslog"]
source = '''
. = parse_syslog!(string!(.message))
'''

[sinks.uptrace]
type = "http"
method = "post"
inputs = ["parse_syslog"]
encoding.codec = "json"
framing.method = "newline_delimited"
compression = "gzip"
request.headers.uptrace-dsn = "http://project2_secret_token@localhost:14318?grpc=14317"
uri = "http://localhost:14318/api/v1/vector/logs"
```

  </CodeGroupItem>
</CodeGroup>

Copy the config above to `vector.toml` and then start Vector:

```shell
vector --config=vector.toml
```

To see the data Vector sends to Uptrace, use the [console](https://vector.dev/docs/reference/configuration/sinks/console/) sink:

```toml
[sinks.my_sink_id]
type = "console"
inputs = [ "my-source-or-transform-id" ]
```

See [vector-logs](https://github.com/uptrace/uptrace/tree/master/example/vector-logs) example for details.

## VRL and attributes

Vector remap language (VRL) allows you to parse logs and set key-value pairs (attributes), for example:

```toml
[transforms.parse_apache]
type = "remap"
inputs = ["apache_common_logs"]
source = '''
. = parse_apache_log!(string!(.message), "common")
.log_source = "apache"
'''
```

You should be careful with attribute names that contain a dot, because Vector uses the dot to create nested structures. For example, this Vector statement:

```toml
.service.name = "my_service"
```

Produces the following nested JSON, which Uptrace no longer recognizes as a `service.name` attribute and leaves as is:

```json
{
  "service": {
    "name": "my_service"
  }
}
```

Instead, you should replace dots with underscores or quote the attribute name:

```toml
.service_name = "my_service"
# or
."service.name" = "my_service"
```

## Nested JSON

If you have nested JSON values, you might want to use [flatten](https://vector.dev/docs/reference/vrl/functions/#flatten) function to transform the value into a single-level representation, for example:

```toml
. = flatten({
	"parent1": {
		"child1": 1,
		"child2": 2
	},
	"parent2": {
		"child3": 3
	}
})
```

Produces:

```json
{
  "parent1.child1": 1,
  "parent1.child2": 2,
  "parent2.child3": 3
}
```

## Display name and grouping

Typically Uptrace is able to automatically generate a short summary for logs using the `log.message` attribute, but occasionally you may want to provide a custom summary.

This is where the `display_name` attribute comes in handy. The `display_name` attribute is a human-readable string that provides a short summary of the log event.

```toml
[transforms.parse_apache]
type = "remap"
inputs = ["apache_common_logs"]
source = '''
. = parse_apache_log!(string!(.message), "common")
.display_name = join([.protocol, .method], " ") ?? ""
'''
```

Uptrace does not use display names for grouping, so you're free to put whatever you want there.

To control how Uptrace groups logs together, you can specify the `grouping_fingerprint` attribute which can be a string or a number (hash). Uptrace will group logs with the same fingerprint together.

```toml
[transforms.parse_apache]
type = "remap"
inputs = ["apache_common_logs"]
source = '''
. = parse_apache_log!(string!(.message), "common")
.grouping_fingerprint = join([.protocol, .method], " ") ?? ""
'''
```

## Log time

Uptraces uses the following fields in order to determine the log time:

1. `timestamp`
2. `datetime`
3. `time`

If such a field is found and it contains a valid time, Uptrace uses the time as the log time and drops the field.

For example:

```
timestamp=2006-01-02T15:04:05Z07:00 rest of the message
time="2006-01-02 15:04:05" rest of the message
{"datetime": "2006-01-02T15:04:05Z07:00", "message": "rest of the message"}
```

Uptrace Enterprise (including Uptrace Cloud) drops logs that are older than 24 hours. The same limitation applies to spans and metrics.

## Converting logs to spans

When parsing HTTP or SQL logs, it might be useful to convert logs into spans by providing span name, duration, and some other fields.

For example, you can set attributes using `remap` transformation:

```toml
[transforms.span_attrs]
type = "remap"
inputs = ["in"]
source = '''
.span_name = "<span name>"
.span_kind = "server"
.span_duration = 12345 # nanoseconds
'''
```

Uptrace recognizes the following span-related attributes:

- `trace_id` in hex-encoded format, for example, `958180131ddde684c1dbda1aeacf51d3`.
- `span_id` is the id of the _parent_ span, for example, `0cf859e4f7510204`.
- `span_name` is the span name. Required.
- `span_kind` is the span kind.
- `span_duration` is the span duration in nanoseconds.

You can also use all available [semantic attributes](https://uptrace.dev/opentelemetry/distributed-tracing.html#attributes).

## Heroku logs

You can [collect logs from Heroku’s Logplex](/ingest/heroku.md) and push them to Uptrace.

## Fly logs

You can ship logs from Fly.io apps to Uptrace using [NATS and Vector](https://github.com/superfly/fly-log-shipper).

## See also

- [FluentBit](fluent-bit.md)
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

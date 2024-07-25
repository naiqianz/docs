---
title: Monitoring logs with Uptrace
---

# Monitoring logs with Uptrace

![Logs monitoring](/cover/logs-monitoring.png)

<!-- prettier-ignore -->
::: tip
To receive notifications about specific logs and errors, see [Alerts and notifications](alerting.md).
:::

[[toc]]

## Infrastructure logs

To monitor infrastructure logs, you can use [Vector](ingest/vector.md) (Heroku, Fly) and [FluentBit](ingest/fluent-bit.md) integrations.

If you are using AWS, you can also send [CloudWatch Logs](ingest/aws-cloudwatch.md#cloudwatch-logs) directly to Uptrace.

## Application logs

To record application logs, you can use [OpenTelemetry span events](https://uptrace.dev/opentelemetry/distributed-tracing.html#event). You must set the event name to `log` and use [semantic attributes](https://uptrace.dev/opentelemetry/distributed-tracing.html#attributes) to record the context:

- `log.severity` to record the log severity. Must be one of `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, and `PANIC`.
- `log.message` to record the message.
- `code.function` to record the function name.
- `code.filepath` to record the file path.
- `code.lineno` to record the line number.

### Go

For example, using Go programming language and OpenTelemetry events API:

```go
span := trace.SpanFromContext(ctx)

span.AddEvent("log", trace.WithAttributes(
    // Log severity and message.
    attribute.String("log.severity", "ERROR"),
    attribute.String("log.message", "request failed"),

    // Optional.
    attribute.String("code.function", "org.FetchUser"),
    attribute.String("code.filepath", "org/user.go"),
    attribute.Int("code.lineno", 123),

    // Additional details.
    attribute.String("foo", "hello world"),
))
```

You can also use instrumentations for popular logging libraries which allow recording logs using a more conventional API, for example, [OpenTelemetry Zap](instrument/opentelemetry-zap.md) and [OpenTelemetry Logrus](instrument/opentelemetry-logrus.md).

### Python

[OpenTelemetry Python](opentelemetry-python.md) comes with a handler for Python's `logging` package so you can just use the standard logging API:

```python
import logging
import uptrace

# Configure OpenTelemetry.
uptrace.configure_opentelemetry(...)

# Use logging API as usual.
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
```

## Grouping logs together

You can control how Uptrace groups logs together by providing `grouping.fingerprint` attribute which can be a string or a number (hash/id):

```toml
log.severity = "info"
log.message = "unstructured log message 123 456 789"
grouping.fingerprint = "unstructured log message"
```

You can further customize grouping using [grouping rules](grouping-rules.md), but this is only available in the paid version.

## Propagating trace context

When collecting third-party logs with Vector or FluentBit, trace context is not automatically [propagated](https://uptrace.dev/opentelemetry/distributed-tracing.html#context) and logs can't be linked with spans.

To propagate context and associate a log record with a span, use the following attribute keys in the log message:

- `trace_id` for TraceId, hex-encoded.
- `span_id` for SpanId, hex-encoded.
- `trace_flags` for trace flags, formatted according to W3C traceflags format.

For example:

```
request failed trace_id=958180131ddde684c1dbda1aeacf51d3 span_id=0cf859e4f7510204
```

## See also

- [Structured logging](https://uptrace.dev/blog/structured-logging.html)
- [Vector](ingest/vector.md)
- [FluentBit](ingest/fluent-bit.md)
- [OpenTelemetry Logs](https://uptrace.dev/opentelemetry/logs.html)

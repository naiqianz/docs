---
title: Converting spans to metrics
---

<CoverImage title="Converting spans to metrics" />

Uptrace allows you to create metrics from spans so they can be monitored using
[alerting rules](alerting.md).

[[toc]]

## Spans metric

First, create `uptrace.tracing.spans` metric from incoming spans:

```yaml
metrics_from_spans:
  - name: uptrace.tracing.spans
    description: Spans count (excluding events)
    instrument: counter
    unit: 1
    value: span.count
    attrs:
      - span.system as system
      - service.name as service
      - host.name as host
      - span.status_code as status
    where: not span.is_event
```

Then, monitor that metric using an alerting rule:

```yaml
alerting:
  rules:
    - name: Service has high error rate
      metrics:
        - uptrace.tracing.spans as $spans
      query:
        - $spans{status="error"} / $spans > 0.1 group by service.name
      for: 5m
```

See [OpenTelemetry Metrics](https://uptrace.dev/opentelemetry/metrics.html) for a list of supported instrument names and more.

## Events metric

You can also create a separate metric for events:

```yaml
metrics_from_spans:
  - name: uptrace.tracing.events
    description: Events count (excluding spans)
    instrument: counter
    unit: 1
    value: span.count
    attrs:
      - span.system as system
      - service.name as service
      - host.name as host
    where: span.is_event
```

And logs:

```yaml
metrics_from_spans:
  - name: uptrace.tracing.logs
    description: Logs count
    instrument: counter
    unit: 1
    value: span.count
    attrs:
      - service.name as service
      - host.name as host
      - log.severity as severity
    where: span.system like 'log:%'
```

## Errors and logs monitoring

You can also monitor individual events for a specific message or an attribute.

For example, to create an alert when a log message contains some pattern:

```yaml
metrics_from_spans:
  - name: uptrace.tracing.suspicious_logs
    description: Number of logs with suspicious log messages
    instrument: counter
    unit: 1
    value: span.count
    attrs:
      - service.name as service
      - host.name as host
      - log.severity as severity
    where: log.message like '%sus%'
    annotations:
      - span.trace_id
      - log.message
```

You can then use annotations in [alerting rules](alerting.md).

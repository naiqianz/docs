---
title: Querying Metrics
---

<CoverImage title="Uptrace: Querying Metrics" />

<!-- prettier-ignore -->
::: tip
To learn about metrics, see [OpenTelemetry Metrics](https://uptrace.dev/opentelemetry/metrics.html) documentation.
:::

Uptrace provides a powerful query language that supports joining, grouping, and aggregating multiple metrics in a single query.

Uptrace aims to be compatible with the Prometheus query language while extending it in a meaningful way. If you're already familiar with PromQL, read [this](promql-compat.md) to learn how Uptrace is different .

[[toc]]

## Writing queries

Uptrace allows you to create dashboards using UI or YAML configuration files. This documentation uses the more compact YAML format, but you can achieve the same with the UI.

YAML:

```yaml
metrics:
  - postgresql_backends as $backends

query:
  - $backends
```

UI:

![Grid item form](/querying-metrics/grid-item-form.png)

You can find the existing dashboard templates on [GitHub](https://github.com/uptrace/uptrace/tree/master/config/dashboard-templates).

## Aliases

Because metric names can be quite long, Uptrace requires you to provide a short metric alias that must start with the dollar sign:

```yaml
metrics:
  # metric aliases always start with the dollar sign
  - system_filesystem_usage as $fs_usage
  - system_network_packets as $packets
```

You must then use the alias instead of the metric name when writing queries:

```yaml
query:
  - sum($fs_usage)
```

Uptrace also allows to specify an alias for expressions:

```yaml
query:
  - $fs_usage{state="used"} as used_space
  - $fs_usage{host_name='host1', device='/dev/sdd1'} as host1_sdd1
```

You can then reference the expression using the alias:

```yaml
metrics:
  - service_cache_redis as $redis
query:
  - $redis{type="hits"} as hits
  - $redis{type="misses"} as misses
  - hits / (hits + misses) as hit_rate
```

## Grouping

Uptrace allows to customize grouping on the metric and function level:

```shell
$metric by (attr1, attr2)
sum($metric by (attr1, attr2))
avg(sum($metric by (attr1, attr2)) by (attr1))
```

You can also specify grouping for the whole expression:

```shell
$metric1 by (type) / $metric2 group by host_name

# The same.
$metric1 by (type, host_name) / $metric2 by (host_name)
```

And for the whole query affecting all expressions:

```shell
$metric1 | metric2 | group by host_name

# The same using expression-wide grouping.
$metric1 group by host_name | $metric2 group by host_name
# Or custom grouping.
$metric1 by (host_name) | $metric2 by (host_name)
```

!!!include(querying-metrics.md)!!!

## Instruments

OpenTelemetry offers various [instruments](https://uptrace.dev/opentelemetry/metrics.html#instruments), each with its own set of aggregate functions:

| Instrument Name                                                                | Timeseries kind         |
| ------------------------------------------------------------------------------ | ----------------------- |
| [Counter][counter], [CounterObserver][counterobserver]                         | [Counter](#counter)     |
| [UpDownCounter][updowncounter], [UpDownCounterObserver][updowncounterobserver] | [Additive](#additive)   |
| [GaugeObserver][gaugeobserver]                                                 | [Gauge](#gauge)         |
| [Histogram][histogram]                                                         | [Histogram](#histogram) |
| [AWS CloudWatch][cloudwatch]                                                   | [Summary](#summary)     |

[counter]: https://uptrace.dev/opentelemetry/metrics.html#counter
[counterobserver]: https://uptrace.dev/opentelemetry/metrics.html#counterobserver
[updowncounter]: https://uptrace.dev/opentelemetry/metrics.html#updowncounter
[updowncounterobserver]: https://uptrace.dev/opentelemetry/metrics.html#updowncounterobserver
[gaugeobserver]: https://uptrace.dev/opentelemetry/metrics.html#gaugeobserver
[histogram]: https://uptrace.dev/opentelemetry/metrics.html#histogram
[cloudwatch]: ingest/aws-cloudwatch.md#metrics

### Counter

Counter is a timeseries kind that measures additive non-decreasing values, for example, the **total** number of:

- processed requests
- received bytes
- disk reads

Uptrace supports the following functions to aggregate `counter` timeseries:

| Expression         | Result timeseries    |
| ------------------ | -------------------- |
| `$metric`          | Sum of timeseries    |
| `per_min($metric)` | `$metric / _minutes` |
| `per_sec($metric)` | `$metric / _seconds` |

### Gauge

Gauge is a timeseries kind that measures non-additive values for which sum does not produce a meaningful correct result, for example:

- error rate
- memory utilization
- cache hit rate

Uptrace supports the following functions to aggregate `gauge` timeseries:

| Expression         | Result timeseries                     |
| ------------------ | ------------------------------------- |
| `$metric`          | Avg of timeseries                     |
| `avg($metric)`     | Avg of timeseries                     |
| `min($metric)`     | Min of timeseries                     |
| `max($metric)`     | Max of timeseries                     |
| `sum($metric)`     | Sum of timeseries                     |
| `per_min($metric)` | `$metric / _minutes`                  |
| `per_sec($metric)` | `$metric / _seconds`                  |
| `delta($metric)`   | Diff between curr and previous values |

\* Note that the `sum`, `per_min`, `per_sec`, and `delta` functions should not be normally used with this instrument and were added only for compatibility with Prometheus and AWS metrics. For the same reason, `per_min(sum($metric))` and `delta(sum($metric))` are also supported.

### Additive

Additive is a timeseries kind which measures additive values that increase or decrease with time, for example, the number of:

- active requests
- open connections
- memory in use (megabytes)

Uptrace supports the following functions to aggregate `additive` timeseries:

| Expression         | Result timeseries                     |
| ------------------ | ------------------------------------- |
| `$metric`          | Sum of timeseries                     |
| `sum($metric)`     | Same as `$metric`                     |
| `avg($metric)`     | Avg of timeseries                     |
| `min($metric)`     | Min of timeseries                     |
| `max($metric)`     | Max of timeseries                     |
| `per_min($metric)` | `$metric / _minutes`                  |
| `per_sec($metric)` | `$metric / _seconds`                  |
| `delta($metric)`   | Diff between curr and previous values |

\* Note that the `delta` function should not be normally used with this instrument and was added only for compatibility with Prometheus and AWS metrics.

### Histogram

Histogram is a timeseries kind that contains a histogram from recorded values, for example:

- request latency
- request size

Uptrace supports the following functions to aggregate `histogram` timeseries:

| Expression       | Result timeseries                       |
| ---------------- | --------------------------------------- |
| `count($metric)` | Number of observed values in timeseries |
| `p50($metric)`   | P50 of timeseries                       |
| `p75($metric)`   | P75 of timeseries                       |
| `p90($metric)`   | P90 of timeseries                       |
| `p95($metric)`   | P95 of timeseries                       |
| `p99($metric)`   | P99 of timeseries                       |
| `avg($metric)`   | `sum($metric) / count($metric)`         |
| `min($metric)`   | Min observed value in the histogram     |
| `max($metric)`   | Max observed value in the histogram     |

Note that you can also use `per_min(count($metric))` and `per_sec(count($metric))`.

### Summary

Sum is a timeseries kind that exists for compatibility with Prometheus and AWS Cloud Watch. It stores the `min`, `max`, `sum`, and `count` aggregates of observed values.

| Expression       | Result timeseries                       |
| ---------------- | --------------------------------------- |
| `sum($metric)`   | Sum of timeseries                       |
| `count($metric)` | Number of observed values in timeseries |
| `avg($metric)`   | `sum($metric) / count($metric)`         |
| `min($metric)`   | Min observed value                      |
| `max($metric)`   | Max observed value                      |

Note that you can also use `per_min(count($metric))` and `per_sec(count($metric))`.

## Misc

### What are timeseries?

A timeseries is a metric with an unique set of attributes, for example, each host has a separate timeseries for the same metric name:

```yaml
# metric_name{ attr1, attr2... }
system_filesystem_usage{host_name='host1'} # timeseries 1
system_filesystem_usage{host_name='host2'} # timeseries 2
```

You can add more attributes to create more detailed and rich timeseries, for example, you can use `state` attribute to report the number of free and used bytes in a filesystem:

```yaml
system_filesystem_usage{host_name='host1', state='free'} # timeseries 1
system_filesystem_usage{host_name='host1', state='used'} # timeseries 2

system_filesystem_usage{host_name='host2', state='free'} # timeseries 3
system_filesystem_usage{host_name='host2', state='used'} # timeseries 4
```

With just 2 attributes, you can write a number of useful queries:

```yaml
# the filesystem size (free+used bytes) on each host
query:
  - sum($fs_usage) group by host_name

# the number of free bytes on each host
query:
  - sum($fs_usage{state='free'}) as free group by host_name

# fs utilization on each host
query:
  - sum($fs_usage{state='used'}) / sum($fs_usage) as fs_util group by host_name

# the size of your dataset on all hosts
query:
  - sum($fs_usage{state='used'}) as dataset_size
```

### Binary operator precedence

The following list shows the precedence of binary operators in Uptrace, from highest to lowest.

- `^`
- `*`, `/`, `%`
- `+`, `-`
- `==`, `!=`, `<=`, `<`, `>=`, `>`
- `and`, `unless`
- `or`

Operators on the same precedence level are left-associative. For example, `2 * 3 % 2` is equivalent to `(2 * 3) % 2`.

## See also

- [OpenTelemetry Metrics](https://uptrace.dev/opentelemetry/metrics.html)
- [OpenTelemetry PostgreSQL metrics](monitor/opentelemetry-postgresql.md)
- [OpenTelemetry Redis metrics](monitor/opentelemetry-redis.md)

# PromQL compatibility

[[toc]]

## Introduction

Uptrace aims to be compatible with the Prometheus query language while extending it in a meaningful way. Most Prometheus queries can be used in Uptrace with minimal modifications, for example, the following Prometheus queries are also valid in Uptrace:

- `$metric_name{foo="xxx",bar~"yyy"}`
- `increase($metric_name)` and `delta($metric_name)`
- `rate($metric_name[5m])` and `irate($metric_name[5m])`
- `avg_over_time($go_goroutines[5m])`
- `avg by (foo)(sum by(foo, bar)($metric_name))`
- `$metric_name offset 1w`
- Math between series with automatic many-to-one/one-to-many vector matching, for example, `sum($mem by (type)) / sum($mem) as mem`.

But there are also some differences between the systems that don't allow you to just copy and paste queries from Prometheus. To ease the migration, you can use Uptrace as a [Prometheus data source in Grafana](grafana.md#prometheus-metrics), which is 100% compatible with the original Prometheus and allows you to use existing Grafana dashboards.

## Aggregation

The main difference between Uptrace and Prometheus is that Prometheus selects all metric attributes by default, while Uptrace does not. Such difference allows Uptrace to read much less data from disk when compared to Prometheus.

```shell
# Prometheus selects all timeseries with all labels.
node_cpu_seconds_total

# Uptrace selects all timeseries but with a single `_hash` label.
node_cpu_seconds_total
```

The difference between the systems goes away when you add an aggregate function or grouping, for example, Prometheus and Uptrace return the same result for the following queries.

```shell
sum(node_cpu_seconds_total)
sum by (instance)(node_cpu_seconds_total)
sum(node_cpu_seconds_total) by (instance)
sum(irate(node_cpu_seconds_total[5m])) by (instance)
```

## Aliases

Because metric names can be quite long, Uptrace requires you to provide a short metric alias that starts with the dollar sign:

```yaml
metrics:
  - node_memory_MemFree_bytes as $mem_free
  - node_memory_Cached_bytes as $cached
```

Such aliases will be used as the resulting timeseries names when querying metrics:

```yaml
query:
  - $mem_free
  - $cached
  - $mem_free + $cached
```

Uptrace also allows to explicitly specify aliases for expressions:

```shell
$mem_free + $cached as total_mem
```

Because Uptrace queries can contain multiple expressions separated with the `|`, you can reference other expressions using their aliases:

```shell
$mem_free + $cached as total_mem | 1 - ($mem_free / total_mem) as mem_utilization
```

## Grouping

Just like Prometheus, Uptrace allows to customize grouping, for example, the following queries return the same result in Uptrace and Prometheus:

```shell
sum by (cpu, mode)(node_cpu_seconds_total)
sum(node_cpu_seconds_total by (cpu, mode))

avg by (cpu)(sum by (cpu, mode)(node_cpu_seconds_total))
avg(sum(node_cpu_seconds_total by (cpu, mode)) by (cpu))
```

In addition, Uptrace supports expression-wide grouping which applies grouping to all metrics in the expression:

```shell
$metric1 by (type) / $metric2 group by host_name

# The same.
$metric1 by (type, host_name) / $metric2 by (host_name)
```

You can also specify global grouping that affects multiple expressions:

```shell
$metric1 | metric2 | group by host_name

# The same using expression-wide grouping.
$metric1 group by host_name | $metric2 group by host_name
# The same but using custom grouping.
$metric1 by (host_name) | $metric2 by (host_name)
```

!!!include(querying-metrics.md)!!!

## Rate interval

Uptrace automatically picks and applies a suitable `$__rate_interval` just like Grafana does:

```shell
# Grafana and Prometheus
irate(node_cpu_seconds_total[$__rate_interval])

# Uptrace
irate(node_cpu_seconds_total)
```

This also works for `increase` and `delta` functions which internally use the result of the `rate` function.

## Range vs instant vectors

Because Uptrace does not distinguish between range and instant vectors, you should omit the lookbehind window and let Uptrace pick a default for you:

```shell
# Omit the window by default.
irate(node_cpu_seconds_total)

# Only specify it when needed.
max_over_time(process_resident_memory_bytes[1d])
```

## Rate and OpenTelemetry

In Prometheus, rollup functions such as `rate` and `increase` play an important role when working with counters. Such functions can be difficult to implement and require users to pick an appropriate lookbehind window to work properly.

In OpenTelemetry, counters are a part of the data model, allowing Uptrace to store delta values instead of monotonically increasing gauges:

```shell
# Prometheus counter values
0 5 10 15

# Uptrace delta counter values
0 5 5 5
```

The value of delta counters is the same as the result of running the `increase` function in Prometheus, except that it is done either directly by OpenTelemetry SDK/Collector or by Uptrace when inserting metrics in ClickHouse. It provides higher accuracy and makes it easier to query such metrics.

By default, Uptrace automatically converts Prometheus counters to OpenTelemtry delta counters, but this requires adjusting your existing Prometheus queries when migrating from Grafana, for example, removing `rate`/`increase` functions.

If this is an issue, or you want to use Uptrace as a [Prometheus data source in Grafana](grafana.md#prometheus-metrics) with existing dashboards, you can enable a special Prometheus compatibility mode on your project settings page and Uptrace will store Prometheus metrics as is.

## Translating Prometheus queries

Number of CPU Cores:

```
# Prometheus
count(count(node_cpu_seconds_total{instance="$node",job="$job"}) by (cpu))

# Uptrace
uniq(node_cpu_seconds_total, cpu)
```

CPU busy:

```
# Prometheus
(sum by(instance) (irate(node_cpu_seconds_total{instance="$node",job="$job", mode!="idle"}[$__rate_interval])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="$node",job="$job"}[$__rate_interval])))) * 100

# Uptrace
sum(irate(node_cpu_seconds_total{mode!="idle"})) / sum(irate(node_cpu_seconds_total)) as cpu_util group by instance, job
```

Sys Load (5m avg):

```
# Prometheus
avg_over_time(node_load5{instance="$node",job="$job"}[$__rate_interval]) * 100 / on(instance) group_left sum by (instance)(irate(node_cpu_seconds_total{instance="$node",job="$job"}[$__rate_interval]))

# Uptrace
avg($load5) / sum(irate(node_cpu_seconds_total)) group by instance, job
```

RootFS Total:

```
# Prometheus
100 - ((avg_over_time(node_filesystem_avail_bytes{instance="$node",job="$job",mountpoint="/",fstype!="rootfs"}[$__rate_interval]) * 100) / avg_over_time(node_filesystem_size_bytes{instance="$node",job="$job",mountpoint="/",fstype!="rootfs"}[$__rate_interval]))

# Uptrace
1 - avg_over_time(node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"}) / avg_over_time(node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}) as fs_used group by instance, job
```

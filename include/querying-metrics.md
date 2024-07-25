## Manipulating attributes

You can rename attributes like this:

```shell
$metric1 by (deployment_environment as env, service_name as service)
$metric1 | group by deployment_environment as env, service_name as service
```

To manipulate attribute values, you can use `replace` and `replace_regexp` functions:

```shell
group by replace(host_name, 'uptrace-prod-', '') as host
group by replace_regexp(host, `^`, 'prefix ') as host
group by replace_regexp(host, `$`, ' suffix') as host
```

To change strings case, use `upper` and `lower` functions:

```shell
group by lower(host_name) as host
group by upper(host_name) as host
```

You can also use a regexp to extract a substring from the attribute value:

```shell
group by extract(host_name, `^uptrace-prod-(\w+)$`) as host
```

## Filtering

Uptrace supports all the same filters just like PromQL:

```shell
node_cpu_seconds_total{cpu="0",mode="idle"}
node_cpu_seconds_total{cpu!="0",mode=~"user|system"}
```

In addition, you can also add global filters that affect all expressions:

```shell
$metric1 | $metric2 | where host = "myhost" | where service = "myservice"

# The same.
$metric1{host="myhost",service="myservice"} | $metric2{host="myhost",service="myservice"}
```

Global filters support the following operators:

- `=`, `!=`, `<`, `<=`, `>`, `>=`, for example, `where host_name = "myhost"`.
- `~`, `!~`, for example, `where host_name ~ "^prod-[a-z]+-[0-9]+$"`.
- `like`, `not like`, for example, `where host_name like "prod-%"`.
- `in`, `not in`, for example, `where host_name in ("host1", "host2")`.

## Joining

Uptrace supports math between series, for example, to add all equally-labelled series from both sides:

```shell
$mem_free + $mem_cached group by host_name, service_name

# The same.
$mem_free by (host_name, service_name) + $mem_cached by (host_name, service_name)
```

Uptrace also automatically supports one-to-many/many-to-one joins:

```shell
# One-to-many
$metric by (type) / $metric by (service_name, type)

# Many-to-one
$metric by (service_name, type) / $metric by (type)
```

You can rename attributes like this:

```shell
$metric by (foo as baz) + $metric by (bar as baz)
```

## Supported functions

Like Prometheus, Uptrace supports 3 different types of functions: aggregate, rollup, and transform.

**Aggregate** functions combine multiple timeseries using the specified function and grouping attributes. When possible, aggregation is pushed down to ClickHouse for maximum efficiency.

- `min`
- `max`
- `sum`
- `avg`
- `median`, `p50`, `p75`, `p90`, `p99`, `count`. Only histograms.

The `count` function returns the number of observed values in a histogram. To count the number of timeseries, use `uniq($metric, attr1, attr2)`, which efficiently counts the number of timeseries directly in ClickHouse.

**Rollup** (or range/window) functions calculate rollups over data points in the specified lookbehind window. The number of timeseries remains the same.

- `min_over_time`, `max_over_time`, `sum_over_time`, `avg_over_time`, `median_over_time`
- `rate` and `irate`
- `increase` and `delta`

**Transform** functions operate on each point of each timeseries. The number of timeseries remains the same.

- `abs`
- `ceil`, `floor`, `trunc`
- `cos`, `cosh`, `acos`, `acosh`
- `sin`, `sinh`, `asin`, `asinh`
- `tan`, `tanh`, `atan`, `atanh`
- `exp`, `exp2`
- `ln`, `log`, `log2`, `log10`
- `perSec` divides each point by the number of seconds in the grouping interval. You can achieve the same with `$metric / _seconds`.
- `perMin` divides each point by the number of minutes in the grouping interval. You can achieve the same with `$metric / _minutes`.

Additionally, **grouping** functions manipulate attributes and can only be used in grouping expressions:

- `lower(attr)` lowers the case of the `attribute` value.
- `upper(attr)` uppers the case of the `attribute` value.
- `trimPrefix(attr, "prefix")` removes the provided leading prefix string.
- `trimSuffix(attr, "suffix")` removes the provided trailing suffix string.
- `extract(haystack, pattern)` extracts a fragment of the `haystack` string using the regular expression `pattern`.
- `replace(haystack, substring, replacement)` replaces all occurrences of the `substring` in `haystack` by the `replacement` string.
- `replaceRegexp(haystack, pattern, replacement)` replaces all occurrences of the substring matching the regular expression `pattern` in `haystack` by the `replacement` string.

If Uptrace does not support the function you need, please [open an issue](https://github.com/uptrace/uptrace/issues) on GitHub.

## Offset

The `offset` modifier allows to set time offset for a query.

For example, this query retrieves the value of `http_requests_total` from 5 minutes ago, relative to the query evaluation time:

```shell
http_requests_total offset 5m
```

A negative offset allows to look ahead of the query evaluation time:

```shell
http_requests_total offset -5m
```

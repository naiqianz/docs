---
title: Querying Spans
---

<CoverImage title="Uptrace: Querying Spans" />

[[toc]]

## Introduction

Uptrace provides a powerful querying language that supports filters (`where _status_code = "error`), grouping (`group by _group_id`), and aggregates (`p50(_duration)`).

![Filters](/querying-spans/filters.png)

To write useful and performant queries, you need to pre-process raw data so it has a well-defined structure. You can achieve that by recording contextual information in span [attributes](https://uptrace.dev/opentelemetry/distributed-tracing.html#attributes) and [events](https://uptrace.dev/opentelemetry/distributed-tracing.html#events). For logs, you can use [structured logging](https://uptrace.dev/blog/structured-logging.html).

## Identifiers

Identifiers are unquoted strings, such as `_name`, `display_name`, `_duration,` etc. You can use them to reference span fields, attributes, and extract values from JSON.

Span fields start with an underscore so they don't conflict with attributes.

| Span field        | Description                    |
| ----------------- | ------------------------------ |
| `_id`             | Span id.                       |
| `_parent_id`      | Span parent id.                |
| `_trace_id`       | Trace id.                      |
| `_name`           | Span name.                     |
| `_event_name`     | Event name.                    |
| `_kind`           | Span kind                      |
| `_duration`       | Span duration in microseconds. |
| `_time`           | Span time.                     |
| `_status_code`    | Span status code.              |
| `_status_message` | Span status message.           |

Attribute names are mostly unchanged except that dots are replaced by underscores, for example:

| Attribute name | Description                                         |
| -------------- | --------------------------------------------------- |
| `display_name` | [display.name](grouping.md#display-name) attribute. |
| `service_name` | OpenTelemetry `service.name` attribute.             |

## Strings

Strings can be single or double quoted, for example:

```
"I'm a string\n"
'I\'m a string\n'
```

You can also use backticks to define strings that don't require/support any escape sequences, for example, to work with regular expressions:

```
replace_regexp(host_name, `^some-prefix-(\w+)$`, `\1`)
```

## Filters

Uptrace allows to filter spans and events by their attributes. Filters start with the keyword `where`, for example, `where display_name contains 'hello'`.

To filter query results, replace `where` prefix with `having`, for example, `having p50(_duration) > 100ms`.

Uptrace supports the following span attribute types:

| Attribute type        | Supported comparison operators                        |
| --------------------- | ----------------------------------------------------- |
| `string`              | `=`, `in`, `like`, `contains`, `~` (regexp), `exists` |
| `int64` and `float64` | `=`, `<`, `<=`, `>`, `>=`, `exists`                   |
| `bool`                | `=`, `!=`                                             |
| `string array`        | `contains`, `exists`                                  |

| Uptrace filter                            | Description                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `where _status_code = "error"`            | Filter spans with `error` status code. Case-sensitive.                                           |
| `where display_name like "hello%"`        | Filter span names that start with "hello". Case-insensitive.                                     |
| `where display_name like "%hello"`        | Filter span names that end with "hello". Case-insensitive.                                       |
| `where display_name contains "hello"`     | Filter span names that contain "hello". Case-insensitive.                                        |
| `where display_name contains "foo\|bar"`  | Same as `display_name contains "foo" OR display_name contains "bar"`.                            |
| `where _duration > 1ms`                   | Same as `_duration > 1000`. Uptrace supports `μs`, `ms`, and `s` units.                          |
| `where http_request_content_length > 1kb` | Same as `http_request_content_length > 1024`. Uptrace supports `kb`, `mb`, `gb`, and `tb` units. |
| `where foo exists`                        | Filter spans that have attribute `foo`.                                                          |

## Grouping

Grouping expressions start with `group by` and work just like the corresponding SQL clause, for example, `group by host_name` groups spans by the attribute `host_name` and at the same time selects the `host_name`.

| Uptrace grouping                         | Note                                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `group by _group_id`                     | Groups similar spans together.                                                                       |
| `group by _start_of_minute`              | Groups spans by the minute they were created. Uptrace also supports grouping by hour, day, and week. |
| `group by host_name`                     | Groups spans by the `host_name` attribute.                                                           |
| `group by service_name, service_version` | Groups spans by the combination of `service_name` and `service_version` attributes.                  |
| `group by lower(attribute)`              | Lowers the case of the `attribute` value.                                                            |

## Aggregate functions

**Aggregate** functions perform a calculation on a set of values, and return a single value. They are often used together with grouping.

| Aggregate function   | Example                            | Note                                 |
| -------------------- | ---------------------------------- | ------------------------------------ |
| `count`              | `count()`                          | Number of matched spans/logs/events. |
| `any`                | `any(_name)`                       | Any (random) span name.              |
| `anyLast`            | `anyLast(_name)`                   | Any last span name.                  |
| `avg`                | `avg(_duration)`                   | Average span duration.               |
| `min, max`           | `max(_duration)`                   | Maximum span duration.               |
| `sum`                | `sum(http_request_content_length)` | Total number of processed bytes.     |
| `p50, p75, p90, p99` | `p50(_duration)`                   | Span duration percentile.            |
| `top3, top10`        | `top3(code_function)`              | Top 3 most popular function names.   |
| `uniq`               | `uniq(http_client_ip)`             | Number of unique IP addresses.       |

Uptrace also supports ClickHouse [if](https://clickhouse.com/docs/en/sql-reference/aggregate-functions/combinators#-if) combinator on aggregate functions, for example:

- `countIf(_status_code = "error")`. Number of matched spans with `_status_code = "error"`.
- `p50If(_duration, service_name = "service1")`. P50 duration for the service `service1`.

Uptrace also provides shortcuts for common aggregations:

| Virtual column | Note                                                     |
| -------------- | -------------------------------------------------------- |
| `_error_rate`  | An alis for `countIf(_status_code = "error") / count()`. |

## Transform functions

**Transform** functions accept a value and return a new value for each matched span/log/event.

| Function                                        | Example                                        | Note                                                                                                                           |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `lower`                                         | `lower(log_severity)`                          | Lowers the string case.                                                                                                        |
| `upper`                                         | `upper(log_severity)`                          | Lowers the string case.                                                                                                        |
| `perMin`                                        | `perMin(count())`                              | Divides the value by the number of minutes in the interval.                                                                    |
| `perSec`                                        | `perSec(count())`                              | Divides the value by the number of seconds in the interval.                                                                    |
| `trimPrefix(str, prefix)`                       | `trimPrefix(str, "prefix")`                    | Removes the provided leading prefix string.                                                                                    |
| `trimSuffix(str, suffix)`                       | `trimSuffix(str, "suffix")`                    | Removes the provided trailing suffix string.                                                                                   |
| `extract(haystack, pattern)`                    | ``extract(host_name, `^uptrace-prod-(\w+)$`)`` | Extracts a fragment of the `haystack` string using the regular expression `pattern`.                                           |
| `replace(haystack, substring, replacement)`     | `replace(host_name, 'uptrace-prod-', '')`      | Replaces all occurrences of the `substring` in `haystack` by the `replacement` string.                                         |
| `replaceRegexp(haystack, pattern, replacement)` | ``replace_regexp(host, `^`, 'prefix ')``       | Replaces all occurrences of the substring matching the regular expression `pattern` in `haystack` by the `replacement` string. |
| `arrayJoin`                                     | `arrayJoin(db_sql_tables)`                     | See ClickHouse [arrayJoin](https://clickhouse.com/docs/en/sql-reference/functions/array-join).                                 |
| `parseInt64`                                    | `parseInt64(str_with_int)`                     | Parses a string as an int64.                                                                                                   |
| `parseFloat64`                                  | `parseFloat64(str_with_float)`                 | Parses a string as a float64.                                                                                                  |
| `parseDateTime`                                 | `parseDateTime(str_with_time)`                 | Parses a string as a date with time.                                                                                           |
| `toStartOfDay`\*                                | `toStartOfDay(_time)`                          | Rounds down a time to the start of the day.                                                                                    |

In addition to `toStartOfDay`, Uptrace also supports `toStartOfHour`, `toStartOfMinute`, `toStartOfSecond`, `toStartOfFiveMinutes`, `toStartOfTenMinutes`, and `toStartOfFifteenMinutes`.

## Combining all together

You can write powerful queries combining filters, grouping, and aggregates together. For example, to select the number of unique visitors for each day excluding bots:

```
where user_agent_is_bot not exists | uniq(client_address) | group by toStartOfDay(_time)
```

![Querying](/querying-spans/querying.png)

# Dashboards

Uptrace allows you to build custom dashboards from spans, events, logs, and metrics using a Prometheus-like [query language](querying-metrics.md).

[[toc]]

## UI or YAML

To build dashboards, you can use a graphical UI or YAML. Both methods have some pros and cons, but both should allow you to achieve the same end result.

To start building a dashboard, go to the "Metrics" -> "Dashboards" and click on the "New dashboard" button.

## Dashboard types

To visualize data, Uptrace uses 2 types of dashboards together:

- A **grid**-based dashboard is a classic grid of charts.

- A **table**-based dashboard is a table where each row leads to the same grid dashboard filtered by group by attributes from the table row, for example, a table of host names with rows leading to the grid dashboard filtered by `host_name = ${host_value}`.

In other words, table dashboards allow you to parameterize grid dashboards with attributes from the table. You can use tables as a replacement for Grafana variables.

It is recommended to start with a table dashboard and add a grid later. The table dashboard should contain a few `group by` attributes and 3-5 most important metrics.

If you don't need a table dashboard, just leave it blank. Grid dashboards can be used without a table dashboard.

### Table dashboards

You can create a table with multiple metrics that are automatically joined together using attributes from the grouping columns.

For example:

```yaml
table:
  # List of metrics with their aliases.
  metrics:
    - system_cpu_utilization as $cpu_util
    - system_cpu_load_average_1m as $load_avg_1m
    - system_memory_utilization as $mem_util
    - system_memory_usage as $mem_usage

  # Query with multiple expressions.
  # Timeseries are automatically joined together by the `host_name`.
  query:
    - group by host_name
    - avg($cpu_util) as cpu_util
    - avg($load_avg_1m)
    - avg($mem_util) as mem_util
    - sum($mem_usage{state="used"}) as mem_used

  # Columns are used to customize table formatting.
  columns:
    cpu_util: { unit: utilization }
    mem_util: { unit: utilization }
```

The dashboard above produces a table like this:

![Table dashboard](/dashboards/table.png)

### Grid dashboards

A grid-based dashboard is a classic grid like in Grafana, where grid elements can be organized in collapsible rows, for example:

```yaml
grid_rows:
  - title: General
    items:
      - title: CPU utilization
        metrics:
          - system_cpu_utilization as $cpu_util
        query:
          - avg($cpu_util)

      - title: CPU time
        metrics:
          - system_cpu_time as $cpu_time
        query:
          - per_min(sum($cpu_time)) as cpu_time group by state
        chart: stacked-area
```

The dashboard above produces a grid like this:

![Grid dashboard](/dashboards/grid.png)

## Dashboard templates

Uptrace comes with pre-built YAML dashboard templates for popular OpenTelemetry instrumentations, for example, [host metrics](https://uptrace.dev/opentelemetry/collector-host-metrics.html), [PostgreSQL](https://uptrace.dev/get/monitor/opentelemetry-postgresql.html), [MySQL](https://uptrace.dev/get/monitor/opentelemetry-mysql.html), and many more. You can find the full list of available templates [here](https://github.com/uptrace/uptrace/tree/master/config/dashboard-templates).

When Uptrace receives new metrics, it checks the available dashboard templates and automatically creates dashboards if there are matching metrics.

In addition to tables and grids, dashboard templates can include metric monitors, for example:

```yaml
monitors:
  - name: CPU usage
    metrics:
      - system_cpu_load_average_15m as $load_avg_15m
      - system_cpu_time as $cpu_time
    query:
      - avg($load_avg_15m) / uniq($cpu_time, cpu) as cpu_util
      - group by host_name
    column: cpu_util
    column_unit: utilization
    max_allowed_value: 3
    check_num_point: 10
```

You can import and export dashboard templates using the Uptrace UI. To share your dashboards with others, you can open a PR on [GitHub](https://github.com/uptrace/uptrace) including the YAML definition.

### System metrics

Uptrace provides some special metrics under the `uptrace_` prefix to access system data such as spans, logs, service graphs, and billing.

The following metrics should be available:

- `uptrace_tracing_spans` - number of spans and their duration (excluding events and logs).
- `uptrace_tracing_events` - number of events (excluding spans and logs).
- `uptrace_tracing_logs` - number of logs (excluding spans and events).
- `uptrace_service_graph_client_duration` - requests duration between two nodes as seen from the client.
- `uptrace_service_graph_server_duration` - requests duration between two nodes as seen from the server.
- `uptrace_service_graph_failed_requests` - total count of failed requests between two nodes.
- `uptrace_billing_sampled_bytes` - number of sampled bytes per project.
- `uptrace_billing_sampled_spans` - number of sampled spans/logs per project.
- `uptrace_billing_dropped_spans` - number of dropped spans/logs per project.
- `uptrace_billing_timeseries` - number of timeseries per project.

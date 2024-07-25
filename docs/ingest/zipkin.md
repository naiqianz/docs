---
title: Ingesting Zipkin Spans
---

<CoverImage title="Ingesting Zipkin Spans" />

[[toc]]

## Zipkin JSON API

Uptrace supports Zipkin JSON API at `/api/v2/spans`:

```shell
curl -X POST 'http://localhost:14318/api/v2/spans' \
  -H 'Content-Type: application/json' \
  -H 'uptrace-dsn: http://project2_secret_token@localhost:14318?grpc=14317' \
  -d @spans.json
```

```json
[
  {
    "id": "352bff9a74ca9ad2",
    "traceId": "5af7183fb1d4cf5f",
    "parentId": "6b221d5bc9e6496c",
    "name": "get /api",
    "timestamp": 1556604172355737,
    "duration": 1431,
    "kind": "SERVER",
    "localEndpoint": {
      "serviceName": "backend",
      "ipv4": "192.168.99.1",
      "port": 3306
    },
    "remoteEndpoint": {
      "ipv4": "172.19.0.2",
      "port": 58648
    },
    "tags": {
      "http.method": "GET",
      "http.path": "/api"
    }
  }
]
```

Uptrace expects a [DSN](../get-started.md#dsn) in the one of the following locations:

- `uptrace-dsn` HTTP header.
- `Authorization` HTTP header.
- `dsn` URL query, for example, `/api/v2/spans?dsn=[dsn]`.

## ClickHouse and OpenTelemetry

To trace the ClickHouse database, you can setup a materialized view to export spans from the [system.opentelemetry_span_log table](https://clickhouse.com/docs/en/operations/system-tables/opentelemetry_span_log) using Zipkin protocol:

```sql
CREATE MATERIALIZED VIEW default.zipkin_spans
ENGINE = URL('http://localhost:14318/api/v2/spans?dsn=http://project2_secret_token@localhost:14318', 'JSONEachRow')
SETTINGS output_format_json_named_tuples_as_objects = 1,
    output_format_json_array_of_rows = 1 AS
SELECT
    lower(hex(trace_id)) AS traceId,
    case when parent_span_id = 0 then '' else lower(hex(parent_span_id)) end AS parentId,
    lower(hex(span_id)) AS id,
    operation_name AS name,
    start_time_us AS timestamp,
    finish_time_us - start_time_us AS duration,
    cast(tuple('clickhouse'), 'Tuple(serviceName text)') AS localEndpoint,
    attribute AS tags
FROM system.opentelemetry_span_log
```

See ClickHouse [documentation](https://clickhouse.com/docs/en/operations/opentelemetry/) for details.

---
title: 'OpenTelemetry database sql [otelsql]'
description: OpenTelemetry SQL provides libraries and tools for instrumenting SQL databases such as PostgreSQL, MySQL, and Microsoft SQL Server to collect telemetry data.
keywords:
  - opentelemetry database sql
  - opentelemetry golang database sql
  - otel database sql
  - otelsql
---

<CoverImage title="Monitor database/sql with OpenTelemetry" />

OpenTelemetry database SQL provides libraries and tools for instrumenting SQL databases such as PostgreSQL, MySQL, and Microsoft SQL Server to collect telemetry data.

database/sql package provides a lightweight and idiomatic interface to row-oriented databases in Golang. It supports most popular relational DBMS via 3-rd party drivers.

This article will teach you how to monitor database/sql performance using OpenTelemetry observability framework.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## OpenTelemetry database/sql

To install otelsql instrumentation:

```shell
go get github.com/uptrace/opentelemetry-go-extra/otelsql
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otelsql/example)
- [Reference](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otelsql)

## Using database/sql

OpenTelemetry SQL allows developers to monitor the performance and behavior of their SQL databases, providing insights into database usage patterns, resource utilization, and performance bottlenecks

To instrument database/sql, you need to connect to a database using the API provided by otelsql:

| sql                         | otelsql                         |
| --------------------------- | ------------------------------- |
| `sql.Open(driverName, dsn)` | `otelsql.Open(driverName, dsn)` |
| `sql.OpenDB(connector)`     | `otelsql.OpenDB(connector)`     |

```go
import (
	"github.com/uptrace/opentelemetry-go-extra/otelsql"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

db, err := otelsql.Open("sqlite", "file::memory:?cache=shared",
	otelsql.WithAttributes(semconv.DBSystemSqlite),
	otelsql.WithDBName("mydb"))
if err != nil {
	panic(err)
}

// db is *sql.DB
```

And then use context-aware API to propagate the active span via [context](https://uptrace.dev/opentelemetry/go-tracing.html#context):

```go
var num int
if err := db.QueryRowContext(ctx, "SELECT 42").Scan(&num); err != nil {
	panic(err)
}
```

## What is Uptrace?

!!!include(what-is-uptrace-2.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Echo](opentelemetry-echo.md)
- [OpenTelemetry Ent](opentelemetry-ent.md)

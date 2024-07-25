---
title: OpenTelemetry Go Ent monitoring [otelent]
keywords:
  - opentelemetry ent
  - otel ent
  - otelent
---

<CoverImage title="Monitor Go Ent with OpenTelemetry" />

Ent is a simple, yet powerful ORM for modeling and querying data. It can generate Go code from an Ent schema for any database.

This article will teach you how to monitor Ent performance using OpenTelemetry Ent instrumentation.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## Go Ent instrumentation

Because Ent works on top of database/sql, you can use [otelsql](opentelemetry-database-sql.md) instrumentation with Ent:

```shell
go get github.com/uptrace/opentelemetry-go-extra/otelsql
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otelsql/example)
- [Reference](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otelsql)

## Usage

To instrument Ent database client, use [OpenTelemetry database/sql instrumentation](opentelemetry-database-sql.md) to patch the database driver you are using.

[Example](https://github.com/ent/ent/tree/master/examples/start):

```diff
- client, err := ent.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
- if err != nil {
- 	log.Fatalf("failed opening connection to sqlite: %v", err)
- }
+ import (
+ 	"github.com/uptrace/opentelemetry-go-extra/otelsql"
+ 	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
+ )

+ db, err := otelsql.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1",
+ 	otelsql.WithAttributes(semconv.DBSystemSqlite),
+ 	otelsql.WithDBName("mydb"))
+ if err != nil {
+ 	panic(err)
+ }
+
+ drv := entsql.OpenDB(dialect.SQLite, db)
+ client := ent.NewClient(ent.Driver(drv))
```

## What is Uptrace?

!!!include(what-is-uptrace-5.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Gin](opentelemetry-gin.md)
- [OpenTelemetry Gorilla Mux](opentelemetry-gorilla-mux.md)

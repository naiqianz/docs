---
title: OpenTelemetry GORM monitoring [otelgorm]
description: OpenTelemetry GORM allows developers to easily add observability to their GORM applications, providing insights into application performance, behavior, and usage patterns.
keywords:
  - opentelemetry gorm
  - otel gorm
  - otelgorm
---

<CoverImage title="Monitor GORM performance with OpenTelemetry" />

Learn how to monitor GORM performance using OpenTelemetry GORM instrumentation.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-1.md)!!!

## What is GORM?

GORM is a popular, high-level ORM (Object-Relational Mapping) library for Go, and OpenTelemetry GORM provides a set of libraries and tools for instrumenting GORM applications to collect telemetry data such as traces, metrics, and logs.

## GORM instrumentation

To install GORM OpenTelemetry instrumentation:

```shell
go get github.com/uptrace/opentelemetry-go-extra/otelgorm
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otelgorm/example)
- [Reference](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otelgorm)

## Usage

OpenTelemetry GORM is designed is easy to use and provides a simple API for instrumenting GORM applications, making it possible for developers to quickly add observability to their applications without having to write a lot of code.

To instrument GORM, you need to install the plugin provided by otelgorm:

```go
import (
	"github.com/uptrace/opentelemetry-go-extra/otelgorm"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
if err != nil {
	panic(err)
}

if err := db.Use(otelgorm.NewPlugin()); err != nil {
	panic(err)
}
```

And then use `db.WithContext(ctx)` to propagate the active span via [context](https://uptrace.dev/opentelemetry/go-tracing.html#context):

```go
var num int
if err := db.WithContext(ctx).Raw("SELECT 42").Scan(&num).Error; err != nil {
	panic(err)
}
```

## What is Uptrace?

!!!include(what-is-uptrace-7.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Go GRPC](opentelemetry-go-grpc.md)
- [OpenTelemetry Logrus](opentelemetry-logrus.md)

---
title: OpenTelemetry Echo by Labstack [otelecho]
keywords:
  - opentelemetry echo
  - otel echo
  - otelecho
---

<CoverImage title="Monitor Labstack Echo with OpenTelemetry" />

Echo is a high performance, extensible, minimalist web framework for Go. It features a highly optimized HTTP router with zero dynamic memory allocations.

In this article you will learn how to monitor and optimize Echo performance using OpenTelemetry Echo instrumentation.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-1.md)!!!

## Echo instrumentation

To install otelecho instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/echo)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho)

## Usage

You can instrument Gin router by installing OpenTelemetry middleware:

```go
import (
	"github.com/labstack/echo/v4"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
)

router := echo.New()
router.Use(otelecho.Middleware("service-name"))
```

## What is Uptrace?

!!!include(what-is-uptrace-4.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Ent](opentelemetry-ent.md)
- [OpenTelemetry gin](opentelemetry-gin.md)

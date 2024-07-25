---
title: OpenTelemetry Gin Monitoring [otelgin]
description: OpenTelemetry Gin instrumentation allows to monitor performance of your Golang applications.
keywords:
  - opentelemetry gin
  - gin opentelemetry
  - otel gin
  - otelgin
---

# Monitor Gin performance with OpenTelemetry

![OpenTelemetry Gin](/cover/opentelemetry-gin.png)

OpenTelemetry Gin can help developers monitor and diagnose issues with their Gin applications, and can provide valuable insights into the behavior of the applications in production.

[[toc]]

## What is Gin?

Gin is a lightweight web framework for building web applications and APIs in the Go programming language. It provides a minimalist and fast approach to building web applications, emphasizing simplicity, performance, and ease of use.

Gin's simplicity and performance make it a popular choice for building web applications and APIs in Go. It provides a solid foundation for developing scalable and efficient web services while maintaining a straightforward and intuitive API.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-6.md)!!!

## Gin instrumentation

Gin OpenTelemetry instrumentation allows developers to easily add observability to their Gin applications, providing insights into application performance, behavior, and usage patterns.

OpenTelemetry Gin provides a simple API for instrumenting Gin applications, making it possible for developers to quickly add observability to their applications without having to write a lot of code.

To install otelgin instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/gin)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin)

## Usage

You can instrument Gin router by installing OpenTelemetry middleware:

```go
import (
	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

router := gin.Default()
router.Use(otelgin.Middleware("service-name"))
```

Once your Gin application is instrumented with OpenTelemetry and telemetry data is exported, you can use observability tools compatible with your chosen [OpenTelemetry backend](https://uptrace.dev/blog/opentelemetry-backend.html) to visualize distributed traces, analyze performance metrics, and gain insight into the behavior of your application.

### Instrumenting templates rendering

To instrument templates rendering, use `otelgin.HTML` helper:

```go
import "go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

func exampleHandler(c *gin.Context) {
	otelgin.HTML(c, http.StatusOK, indexTmpl, gin.H{
		"foo": "bar",
	})
}
```

## What is Uptrace?

!!!include(what-is-uptrace-3.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Gorilla Mux](opentelemetry-gorilla-mux.md)
- [OpenTelemetry GORM](opentelemetry-gorm.md)

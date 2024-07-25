---
title: OpenTelemetry Gorilla Mux monitoring [otelmux]
keywords:
  - opentelemetry gorilla
  - opentelemetry gorilla mux
  - otel gorilla
  - otel gorilla mux
  - otelmux
---

<CoverImage title="Monitor Gorilla Mux with OpenTelemetry" />

gorilla/mux implements a request router and dispatcher for matching incoming requests to their respective handler. It is one of the oldest and most popular routers for Golang.

Learn how you to monitor and optimize Gorilla performance using OpenTelemetry Gorilla Mux instrumentation.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-2.md)!!!

## Gorilla instrumentation

To install otelmux instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/gorilla-mux)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux)

## Usage

You can instrument Gorilla Mux router by installing OpenTelemetry middleware:

```go
import (
	"github.com/gorilla/mux"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux"
)

router := mux.NewRouter()
router.Use(otelmux.Middleware("service-name"))
```

## What is Uptrace?

!!!include(what-is-uptrace-6.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry GORM](opentelemetry-gorm.md)
- [OpenTelemetry Go GRPC](opentelemetry-go-grpc.md)

---
title: OpenTelemetry Slog [otelslog]
description: OpenTelemetry Slog is a plugin for Golang Slog logging library that provides integration with OpenTelemetry.
keywords:
  - opentelemetry slog
  - otel slog
  - otelslog
---

<CoverImage title="Collecting Golang Slog logs with OpenTelemetry" />

OpenTelemetry Slog is a handler for the new standard Golang [structured logging](https://uptrace.dev/blog/structured-logging.html) library. The handler intercepts log messages and injects relevant OTel data into them. This data includes trace and span IDs that help correlate logs with specific requests or operations within a distributed system.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-1.md)!!!

## Otelslog

To install otelslog instrumentation:

```shell
go get go.opentelemetry.io/contrib/bridges/otelslog
```

To configure slog with Otel handler:

```go
import "go.opentelemetry.io/contrib/bridges/otelslog"

slog.SetDefault(otelslog.NewLogger("app_or_package_name"))
```

- [Example](https://github.com/uptrace/uptrace/tree/master/example/go-slog)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/bridges/otelslog)

## Usage

Here is how you configure slog and OpenTelemetry:

```go
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	slogotel "github.com/remychantenay/slog-otel"
	"github.com/uptrace/uptrace-go/uptrace"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func main() {
	ctx := context.Background()

	uptrace.ConfigureOpentelemetry()
	defer uptrace.Shutdown(ctx)

	// Configure slog with Otel handler.
	slog.SetDefault(otelslog.NewLogger("app_or_package_name"))

	tracer := otel.Tracer("slog-example")

	ctx, span := tracer.Start(ctx, "operation-name")
	defer span.End()

	slog.ErrorContext(ctx, "Hello world!", "locale", "en_US")
	fmt.Println(uptrace.TraceURL(trace.SpanFromContext(ctx)))
}
```

OpenTelemetry Slog adheres to the OpenTelemetry standards, ensuring compatibility with various tracing and monitoring tools that support OpenTelemetry. This flexibility prevents vendor lock-in and simplifies integration with your existing monitoring infrastructure.

## What is Uptrace?

!!!include(what-is-uptrace-5.md)!!!

## What's next?

OpenTelemetry Slog is a valuable tool for improving the observability of Golang applications that use Slog for logging. By correlating logs with OpenTelemetry trace context, you can gain a deeper understanding of your application's behavior and more effectively diagnose problems and optimize performance.

- [Golang logging libraries](https://uptrace.dev/blog/golang-logging.html)
- [Golang monitoring](https://uptrace.dev/blog/golang-monitoring.html)

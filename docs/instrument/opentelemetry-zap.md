---
title: OpenTelemetry Zap logs [otelzap]
description: OpenTelemetry Zap is a plugin for Zap logging library that provides integration with OpenTelemetry.
keywords:
  - opentelemetry zap
  - otel zap
  - otelzap
---

<CoverImage title="Collecting Zap logs with OpenTelemetry" />

With OpenTelemetry Zap, you can automatically generate OpenTelemetry events from your logging statements. This can be useful for understanding how your application is behaving in production and diagnosing issues.

OpenTelemetry Zap automatically injects trace and span IDs for each logging statement, allowing you to correlate your logs with other telemetry data from your application.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-3.md)!!!

## Zap instrumentation

To install otelzap instrumentation:

```shell
go get github.com/uptrace/opentelemetry-go-extra/otelzap
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otelzap/example)
- [Reference](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otelzap)

## Usage

otelzap instrumentation records Zap log messages as events on the existing span from the passed `context.Context`. It does not record anything if the context does not contain a span.

You need to create an `otelzap.Logger` using this package and pass a [context](https://uptrace.dev/opentelemetry/go-tracing.html#context) to propagate the active span.

```go
import (
    "go.uber.org/zap"
    "github.com/uptrace/opentelemetry-go-extra/otelzap"
)

// Wrap zap logger to extend Zap with API that accepts a context.Context.
log := otelzap.New(zap.NewExample())

// And then pass ctx to propagate the span.
log.Ctx(ctx).Error("hello from zap",
	zap.Error(errors.New("hello world")),
	zap.String("foo", "bar"))

// Alternatively.
log.ErrorContext(ctx, "hello from zap",
	zap.Error(errors.New("hello world")),
	zap.String("foo", "bar"))
```

Both variants are fast and don't allocate. See [example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otelzap/example) for details.

## Global logger

Just like Zap, otelzap provides a global logger that can be set with `otelzap.ReplaceGlobals`:

```go
package main

import (
	"go.uber.org/zap"
	"github.com/uptrace/opentelemetry-go-extra/otelzap"
)

func main() {
	logger := otelzap.New(zap.NewExample())
	defer logger.Sync()

	undo := otelzap.ReplaceGlobals(logger)
	defer undo()

	otelzap.L().Info("replaced zap's global loggers")
	otelzap.Ctx(context.TODO()).Info("... and with context")
}
```

## Sugared logger

You can also use sugared logger API in a similar way:

```go
log := otelzap.New(zap.NewExample())
sugar := log.Sugar()

sugar.Ctx(ctx).Infow("failed to fetch URL",
	// Structured context as loosely typed key-value pairs.
	"url", url,
	"attempt", 3,
	"backoff", time.Second,
)
sugar.InfowContext(ctx, "failed to fetch URL",
	// Structured context as loosely typed key-value pairs.
	"url", url,
	"attempt", 3,
	"backoff", time.Second,
)

sugar.Ctx(ctx).Infof("Failed to fetch URL: %s", url)
sugar.InfofContext(ctx, "Failed to fetch URL: %s", url)
```

## What is Uptrace?

!!!include(what-is-uptrace-7.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Go Zero](opentelemetry-go-zero.md)
- [OpenTelemetry Express.js](opentelemetry-express.md)

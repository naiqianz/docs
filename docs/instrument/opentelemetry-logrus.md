---
title: OpenTelemetry Logrus logs [otellogrus]
description: OpenTelemetry Logrus injects trace and span IDs for each logging statement, allowing you to correlate your logs with other telemetry data.
keywords:
  - opentelemetry logrus
  - otel logrus
  - otellogrus
---

<CoverImage title="Collecting Logrus logs with OpenTelemetry" />

OpenTelemetry Logrus is a plugin for Logrus logging library that provides integration with OpenTelemetry. Logrus is a popular logging library for Go programming language that provides a simple and easy-to-use API for logging messages in your applications.

OpenTelemetry Logrus automatically injects trace and span IDs for each logging statement, allowing you to correlate your logs with other telemetry data from your application.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## Logrus instrumentation

To install otellogrus instrumentation:

```shell
go get github.com/uptrace/opentelemetry-go-extra/otellogrus
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/otellogrus/example)
- [Reference](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otellogrus)

## Usage

You need to install an `otellogrus.Hook` and use `logrus.WithContext` to propagate the active span.

```go
import (
    "github.com/uptrace/opentelemetry-go-extra/otellogrus"
    "github.com/sirupsen/logrus"
)

// Instrument logrus.
logrus.AddHook(otellogrus.NewHook(otellogrus.WithLevels(
	logrus.PanicLevel,
	logrus.FatalLevel,
	logrus.ErrorLevel,
	logrus.WarnLevel,
)))

// Use ctx to pass the active span.
logrus.WithContext(ctx).
	WithError(errors.New("hello world")).
	WithField("foo", "bar").
	Error("something failed")
```

## Options

[otellogrus.NewHook](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otellogrus#NewHook) accepts the following [options](https://pkg.go.dev/github.com/uptrace/opentelemetry-go-extra/otellogrus#Option):

- `otellogrus.WithLevels(logrus.PanicLevel, logrus.FatalLevel, logrus.ErrorLevel, logrus.WarnLevel)` sets the logrus logging levels on which the hook is fired.
- `WithErrorStatusLevel(logrus.ErrorLevel)` sets the minimal logrus logging level on which the span status is set to codes.Error.

## What is Uptrace?

!!!include(what-is-uptrace-2.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry net/http](opentelemetry-net-http.md)
- [OpenTelemetry Zap](opentelemetry-zap.md)

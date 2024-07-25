---
title: OpenTelemetry Beego monitoring [otelbeego]
description: OpenTelemetry Beego is an OpenTelemetry instrumentation for the Beego web framework, a popular open-source web framework for building web applications in Go.
keywords:
  - opentelemetry beego
  - beego opentelemetry
  - otel beego
  - otelbeego
---

<CoverImage title="Monitor Beego with OpenTelemetry Instrumentation" />

OpenTelemetry Beego is an OpenTelemetry instrumentation for the Beego web framework, a popular open-source web framework for building web applications in Go.

This article will teach you how to monitor Beego performance using OpenTelemetry observability framework.

[[toc]]

## What is Beego?

Beego is an open source web framework written in Go. It follows the Model-View-Controller (MVC) architectural pattern and provides a set of tools and features for rapidly building web applications and APIs. Beego focuses on simplicity, scalability, and modularity.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-5.md)!!!

## OpenTelemetry Beego

OpenTelemetry Beego allows developers to monitor the performance and behavior of their Beego applications, providing insights into application usage patterns, resource utilization, and performance bottlenecks.

To install otelbeego OpenTelemetry instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/beego)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego)

## Usage

To integrate OpenTelemetry with Beego, you can use the OpenTelemetry Go SDK to instrument your Beego application and collect telemetry data. By adding OpenTelemetry instrumentation to your application, you can collect distributed traces, metrics, and logs, adding observability to your Beego-based web application.

You can instrument Beego by installing with OpenTelemetry middleware:

```go
import (
	"github.com/astaxie/beego"
	"go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego"
)

mware := otelbeego.NewOTelBeegoMiddleWare("service-name")
beego.RunWithMiddleWares(":7777", mware)
```

### Instrumenting templates rendering

To instrument templates rendering, disable autorender and use helpers from otelbeego package:

```go
import "go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego"

beego.BConfig.WebConfig.AutoRender = false

err := otelbeego.Render(&c.Controller)
```

See the [example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/beego) and the reference:

- [otelbeego.Render](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego#Render)
- [otelbeego.RenderBytes](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/astaxie/beego/otelbeego#RenderBytes)
- [otelbeego.RenderString](https://github.com/open-telemetry/opentelemetry-go-contrib/blob/instrumentation/github.com/astaxie/beego/otelbeego/v0.25.0/instrumentation/github.com/astaxie/beego/otelbeego/beego.go#L116)

## What is Uptrace?

!!!include(what-is-uptrace-1.md)!!!

## What's next?

By using OpenTelemetry with Beego, you can leverage the capabilities of both frameworks to build scalable, observable, and high-performance web applications.

!!!include(next-go.md)!!!

- [OpenTelemetry database sql](opentelemetry-database-sql.md)
- [OpenTelemetry Echo](opentelemetry-echo.md)

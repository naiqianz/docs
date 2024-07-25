---
title: OpenTelemetry Golang net http [otelhttp]
keywords:
  - opentelemetry net http
  - otel net http
  - otelhttp
---

<CoverImage title="Monitor Go net/http performance with OpenTelemetry" />

Learn how to monitor net/http performance using OpenTelemetry observability framework.

Package net/http provides HTTP client and server implementations. It allows you to make and serve HTTP requests in Golang.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-5.md)!!!

## net/http instrumentation

To install otelhttp instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/net-http)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp)

## Instrumenting http.Server

You can instrument HTTP server by wrapping all your handlers:

```go
handler := http.Handler(http.DefaultServeMux) // or use your router
handler = otelhttp.NewHandler(handler, "")

httpServer := &http.Server{
    Addr:         ":8888",
	ReadTimeout:  5 * time.Second,
	WriteTimeout: 10 * time.Second,
	IdleTimeout:  60 * time.Second,
	Handler:      handler,
}

err := httpServer.ListenAndServe()
```

### Filtering requests

You can exclude some requests from being traced using [otelhttp.WithFilter](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#WithFilter):

```go
handler = otelhttp.NewHandler(handler, "", otelhttp.WithFilter(otelReqFilter))

func otelReqFilter(req *http.Request) bool {
	return req.URL.Path != "/ping"
}
```

### Span name

You can customize span name formatting using [otelhttp.WithSpanNameFormatter](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#WithSpanNameFormatter):

```go
handler = otelhttp.NewHandler(handler, "", otelhttp.WithSpanNameFormatter(httpSpanName))

func spanName(operation string, req *http.Request) string {
	return operation
}
```

### Route attribute

If you are instrumenting individual handlers (not all handlers at once), you can annotate handler spans with `http.route` attribute. This can be useful when you can't find an instrumentation for your router.

```go
handler = otelhttp.WithRouteTag("/hello/:username", handler)
```

## Instrumenting http.Client

otelhttp provides a HTTP transport to instrument `http.Client`:

```go
client := http.Client{
	Transport: otelhttp.NewTransport(http.DefaultTransport),
}
```

You can also use the following shortcuts to make HTTP requets:

- [otelhttp.Get](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#Get)
- [otelhttp.Post](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#Post)
- [otelhttp.PostForm](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#PostForm)
- [otelhttp.Head](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp#Head)

```go
import "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"

resp, err := otelhttp.Get(ctx, "https://google.com/")
```

## What is Uptrace?

!!!include(what-is-uptrace-3.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Zap](opentelemetry-zap.md)
- [OpenTelemetry Go Zero](opentelemetry-go-zero.md)

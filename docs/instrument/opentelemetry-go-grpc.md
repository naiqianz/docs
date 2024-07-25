---
title: OpenTelemetry Golang gRPC monitoring [otelgrpc]
description: OpenTelemetry gRPC is an OpenTelemetry instrumentation for collecting telemetry data from gRPC applications.
keywords:
  - opentelemetry grpc
  - otel grpc
  - otelgrpc
---

<CoverImage title="Monitoring Golang gRPC with OpenTelemetry" />

OpenTelemetry gRPC is an OpenTelemetry instrumentation for collecting telemetry data from gRPC applications.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-1.md)!!!

## What is gRPC?

gRPC is a cross-platform open source high performance Remote Procedure Call (RPC) framework for Golang. gRPC is ideal for lightweight microservices where efficiency is critical.

gRPC provides efficient communication between distributed systems, allowing them to interact and exchange data in a reliable and scalable manner.

## gRPC instrumentation

OpenTelemetry gRPC is easy to use and provides a simple API for instrumenting gRPC applications, making it possible for developers to quickly add observability to their gRPC applications without having to write a lot of code.

To install otelgrpc instrumentation:

```shell
go get go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc
```

- [Example](https://github.com/uptrace/opentelemetry-go-extra/tree/main/example/grpc)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc)

## Usage

To instrument gRPC client:

```go
import (
	"google.golang.org/grpc"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
)

conn, err := grpc.Dial(target,
	grpc.WithInsecure(),
	grpc.WithStatsHandler(otelgrpc.NewClientHandler()),
)
```

To instrument gRPC server:

```go
import (
	"google.golang.org/grpc"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
)

server := grpc.NewServer(
    grpc.StatsHandler(otelgrpc.NewServerHandler()),
)
```

### Metadata and baggage

On the client side, you can use gRPC metadata as a [baggage](https://uptrace.dev/opentelemetry/distributed-tracing.html#baggage):

```go
import "google.golang.org/grpc/metadata"

md := metadata.Pairs(
	"key1", "value1",
	"key2", "value2",
)
ctx := metadata.NewOutgoingContext(context.Background(), md)
```

On the server side, you can extract gRPC metadata from the incoming request:

```go
import "google.golang.org/grpc/metadata"

md, ok := metadata.FromIncomingContext(ctx); ok {
    fmt.Println(md)
}
```

Or use OpenTelemetry baggage API:

```go
import "go.opentelemetry.io/otel/baggage"

baggage := baggage.FromContext(ctx)
```

## What is Uptrace?

!!!include(what-is-uptrace-4.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Logrus](opentelemetry-logrus.md)
- [OpenTelemetry net/http](opentelemetry-net-http.md)

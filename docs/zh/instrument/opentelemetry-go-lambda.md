---
title: Monitor AWS Lambda Golang with OpenTelemetry
---

<CoverImage title="Monitor AWS Lambda Golang with OpenTelemetry" />

AWS Lambda is a serverless, event-driven compute service that lets you run code without provisioning or managing servers.

You can use OpenTelemetry with AWS Lambda to enable distributed tracing and observability for serverless applications.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-5.md)!!!

## AWS Lambda containers

Lambda runs the code in isolated containers dynamically scaling the number of containers as needed. When there are no new requests, Lambda freezes idle containers.

When the container is frozen, all processes in the container will be frozen as well. If the process uses a timer to flush the buffered data, the timer won’t fire until the container thaws. The interval between the frozen and the thaw state is unpredictable, ranging from seconds to hours.

To mitigate that problem, the instrumentation has to flush data out before the Lambda function returns.

## Installation

To install OpenTelemetry AWS Lambda instrumentation:

```shell
go get -u go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda
```

- [Example](https://github.com/open-telemetry/opentelemetry-go-contrib/tree/main/instrumentation/github.com/aws/aws-lambda-go/otellambda/example)
- [Reference](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda)

## Usage

You can instrument your AWS Lambda function with OpenTelemetry like this:

```go
import "go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda"

func main() {
	lambda.Start(otellambda.InstrumentHandler(HandleRequest))
}
```

To use otellambda with [OpenTelemetry Go](../opentelemetry-go.md), you need to configure `otellambda.WithFlusher` with the tracer provider used by Uptrace.

```go
import (
	"go.opentelemetry.io/contrib/propagators/aws/xray"
	"go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda"
	"go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda/xrayconfig"
	"github.com/uptrace/uptrace-go/uptrace"
)

func main() {
	ctx := context.Background()

	uptrace.ConfigureOpentelemetry(
		// copy your project DSN here or use UPTRACE_DSN env var
		//uptrace.WithDSN("https://token@api.uptrace.dev/project_id"),

		uptrace.WithServiceName("myservice"),
		uptrace.WithServiceVersion("v1.0.0"),
	)
	defer uptrace.Shutdown(ctx)

	tp := uptrace.TracerProvider()
	lambda.Start(otellambda.InstrumentHandler(
		lambdaHandler(ctx),
		// Flush buffered spans to Uptrace.
		otellambda.WithFlusher(tp),
	))
}
```

See [aws-lambda](https://github.com/uptrace/uptrace-go/tree/master/example/aws-lambda) example for details.

## OpenTelemetry Lambda

Alternatively, you can add [opentelemetry-lambda](https://github.com/open-telemetry/opentelemetry-lambda) as a Lambda layer, but it does not offer any advantages at the moment. See the [example](https://github.com/open-telemetry/opentelemetry-lambda/tree/main/go) for details.

## What is Uptrace?

!!!include(what-is-uptrace-5.md)!!!

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry Beego](opentelemetry-beego.md)
- [OpenTelemetry Go Zero](opentelemetry-go-zero.md)

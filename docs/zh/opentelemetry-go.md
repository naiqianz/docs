# OpenTelemetry Go distro for Uptrace

<a href="https://github.com/uptrace/uptrace-go" target="_blank">
  <img src="/devicon/go-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry Go SDK to export spans and metrics to Uptrace using OTLP/gRPC.

To learn about OpenTelemetry API, see [OpenTelemetry Go Tracing API](https://uptrace.dev/opentelemetry/go-tracing.html) and [OpenTelemetry Go Metrics API](https://uptrace.dev/opentelemetry/go-metrics.html).

[[toc]]

## Uptrace Go

[uptrace-go](https://github.com/uptrace/uptrace-go) is a thin wrapper over [opentelemetry-go](https://github.com/open-telemetry/opentelemetry-go) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

To install uptrace-go:

```shell
go get github.com/uptrace/uptrace-go
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

<ProjectPicker v-model="activeProject" :projects="projects" />

```go:no-v-pre
import "github.com/uptrace/uptrace-go/uptrace"

uptrace.ConfigureOpentelemetry(
    // copy your project DSN here or use UPTRACE_DSN env var
    //uptrace.WithDSN("{{ dsn }}"),

	uptrace.WithServiceName("myservice"),
	uptrace.WithServiceVersion("v1.0.0"),
	uptrace.WithDeploymentEnvironment("production"),
)
```

You can find the full list of available options at [pkg.go.dev](https://pkg.go.dev/github.com/uptrace/uptrace-go/uptrace#Option).

| Option                      | Description                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `WithDSN`                   | A data source that specifies Uptrace project credentials. For example, `https://token@api.uptrace.dev/project_id`.                   |
| `WithServiceName`           | `service.name` resource attribute. For example, `myservice`.                                                                         |
| `WithServiceVersion`        | `service.version` resource attribute. For example, `1.0.0`.                                                                          |
| `WithDeploymentEnvironment` | `deployment.environment` resource attribute. For example, `production`.                                                              |
| `WithResourceAttributes`    | Any other resource attributes.                                                                                                       |
| `WithResourceDetectors`     | Configures additional [resource detectors](#resource-detectors), for example, EC2 detector or GCE detector.                          |
| `WithResource`              | Resource contains attributes representing an entity that produces telemetry. Resource attributes are copied to all spans and events. |

!!!include(env-vars.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 1**. Install [uptrace-go](https://github.com/uptrace/uptrace-go):

```shell
go get github.com/uptrace/uptrace-go
```

- **Step 2**. Copy the [code](https://github.com/uptrace/uptrace-go/tree/master/example/basic) to `main.go` replacing the DSN:

<ProjectPicker v-model="activeProject" :projects="projects" />

```go:no-v-pre
package main

import (
	"context"
	"errors"
	"fmt"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"

	"github.com/uptrace/uptrace-go/uptrace"
)

func main() {
	ctx := context.Background()

	// Configure OpenTelemetry with sensible defaults.
	uptrace.ConfigureOpentelemetry(
		// copy your project DSN here or use UPTRACE_DSN env var
		// uptrace.WithDSN("{{ dsn }}"),

		uptrace.WithServiceName("myservice"),
		uptrace.WithServiceVersion("1.0.0"),
	)
	// Send buffered spans and free resources.
	defer uptrace.Shutdown(ctx)

	// Create a tracer. Usually, tracer is a global variable.
	tracer := otel.Tracer("app_or_package_name")

	// Create a root span (a trace) to measure some operation.
	ctx, main := tracer.Start(ctx, "main-operation")
	// End the span when the operation we are measuring is done.
	defer main.End()

	// The passed ctx carries the parent span (main).
	// That is how OpenTelemetry manages span relations.
	_, child1 := tracer.Start(ctx, "GET /posts/:id")
	child1.SetAttributes(
		attribute.String("http.method", "GET"),
		attribute.String("http.route", "/posts/:id"),
		attribute.String("http.url", "http://localhost:8080/posts/123"),
		attribute.Int("http.status_code", 200),
	)
	if err := errors.New("dummy error"); err != nil {
		child1.RecordError(err, trace.WithStackTrace(true))
		child1.SetStatus(codes.Error, err.Error())
		child1.End()
	}

	_, child2 := tracer.Start(ctx, "SELECT")
	child2.SetAttributes(
		attribute.String("db.system", "mysql"),
		attribute.String("db.statement", "SELECT * FROM posts LIMIT 100"),
	)
	child2.End()

	fmt.Printf("trace: %s\n", uptrace.TraceURL(main))
}
```

- **Step 3**. Run the code to get a link for the generated trace:

```shell
go run main.go
trace: https://app.uptrace.dev/traces/<trace_id>
```

- **Step 4**. Follow the link to view the trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-go/tree/master/example/otlp-traces-http) is how you can export traces to Uptrace following the recommendations above:

```go
package main

import (
	"context"
	"fmt"
	"os"

	"go.opentelemetry.io/contrib/propagators/aws/xray"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

func main() {
	ctx := context.Background()

	dsn := os.Getenv("UPTRACE_DSN")
	if dsn == "" {
		panic("UPTRACE_DSN environment variable is required")
	}
	fmt.Println("using DSN:", dsn)

	exporter, err := otlptracehttp.New(
		ctx,
		otlptracehttp.WithEndpoint("otlp.uptrace.dev"),
		otlptracehttp.WithHeaders(map[string]string{
			// Set the Uptrace DSN here or use UPTRACE_DSN env var.
			"uptrace-dsn": dsn,
		}),
		otlptracehttp.WithCompression(otlptracehttp.GzipCompression),
	)
	if err != nil {
		panic(err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(exporter,
		sdktrace.WithMaxQueueSize(10_000),
		sdktrace.WithMaxExportBatchSize(10_000))
	// Call shutdown to flush the buffers when program exits.
	defer bsp.Shutdown(ctx)

	resource, err := resource.New(ctx,
		resource.WithFromEnv(),
		resource.WithTelemetrySDK(),
		resource.WithHost(),
		resource.WithAttributes(
			attribute.String("service.name", "myservice"),
			attribute.String("service.version", "1.0.0"),
		))
	if err != nil {
		panic(err)
	}

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(resource),
		sdktrace.WithIDGenerator(xray.NewIDGenerator()),
	)
	tracerProvider.RegisterSpanProcessor(bsp)

	// Install our tracer provider and we are done.
	otel.SetTracerProvider(tracerProvider)

	tracer := otel.Tracer("app_or_package_name")
	ctx, span := tracer.Start(ctx, "main")
	defer span.End()

	fmt.Printf("trace: https://app.uptrace.dev/traces/%s\n", span.SpanContext().TraceID())
}
```

### Exporting metrics

[Here](https://github.com/uptrace/uptrace-go/tree/master/example/otlp-metrics-grpc) is how you can export metrics to Uptrace following the recommendations above:

```go
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/metric"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/metric/metricdata"
	"go.opentelemetry.io/otel/sdk/resource"
	"google.golang.org/grpc/encoding/gzip"
)

func main() {
	ctx := context.Background()

	dsn := os.Getenv("UPTRACE_DSN")
	if dsn == "" {
		panic("UPTRACE_DSN environment variable is required")
	}
	fmt.Println("using DSN:", dsn)

	exporter, err := otlpmetricgrpc.New(ctx,
		otlpmetricgrpc.WithEndpoint("otlp.uptrace.dev:4317"),
		otlpmetricgrpc.WithHeaders(map[string]string{
			// Set the Uptrace DSN here or use UPTRACE_DSN env var.
			"uptrace-dsn": dsn,
		}),
		otlpmetricgrpc.WithCompressor(gzip.Name),
		otlpmetricgrpc.WithTemporalitySelector(preferDeltaTemporalitySelector),
	)
	if err != nil {
		panic(err)
	}

	reader := sdkmetric.NewPeriodicReader(
		exporter,
		sdkmetric.WithInterval(15*time.Second),
	)

	resource, err := resource.New(ctx,
		resource.WithFromEnv(),
		resource.WithTelemetrySDK(),
		resource.WithHost(),
		resource.WithAttributes(
			attribute.String("service.name", "myservice"),
			attribute.String("service.version", "1.0.0"),
		))
	if err != nil {
		panic(err)
	}

	provider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(reader),
		sdkmetric.WithResource(resource),
	)
	otel.SetMeterProvider(provider)

	meter := provider.Meter("app_or_package_name")
	counter, _ := meter.Int64Counter(
		"uptrace.demo.counter_name",
		metric.WithUnit("1"),
		metric.WithDescription("counter description"),
	)

	fmt.Println("exporting data to Uptrace...")
	for {
		counter.Add(ctx, 1)
		time.Sleep(time.Millisecond)
	}
}

func preferDeltaTemporalitySelector(kind sdkmetric.InstrumentKind) metricdata.Temporality {
	switch kind {
	case sdkmetric.InstrumentKindCounter,
		sdkmetric.InstrumentKindObservableCounter,
		sdkmetric.InstrumentKindHistogram:
		return metricdata.DeltaTemporality
	default:
		return metricdata.CumulativeTemporality
	}
}
```

### Exporting logs

[Here](https://github.com/uptrace/uptrace-go/tree/master/example/otlp-logs-http) is how you can export logs to Uptrace following the recommendations above:

```go
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/contrib/propagators/aws/xray"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/log/global"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

func main() {
	ctx := context.Background()

	dsn := os.Getenv("UPTRACE_DSN")
	if dsn == "" {
		panic("UPTRACE_DSN environment variable is required")
	}
	fmt.Println("using DSN:", dsn)

	resource, err := resource.New(ctx,
		resource.WithFromEnv(),
		resource.WithTelemetrySDK(),
		resource.WithHost(),
		resource.WithAttributes(
			attribute.String("service.name", "myservice"),
			attribute.String("service.version", "1.0.0"),
		))
	if err != nil {
		panic(err)
	}

	shutdownTracing := configureTracing(ctx, dsn, resource)
	defer shutdownTracing()

	shutdownLogging := configureLogging(ctx, dsn, resource)
	defer shutdownLogging()

	tracer := otel.Tracer("app_or_package_name")
	logger := otelslog.NewLogger("app_or_package_name")

	ctx, main := tracer.Start(ctx, "main-operation", trace.WithSpanKind(trace.SpanKindServer))
	defer main.End()

	logger.ErrorContext(ctx, "hello world", slog.String("error", "error message"))

	fmt.Printf("trace: https://app.uptrace.dev/traces/%s\n", main.SpanContext().TraceID())
}

func configureLogging(ctx context.Context, dsn string, resource *resource.Resource) func() {
	exp, err := otlploghttp.New(ctx,
		otlploghttp.WithEndpoint("otlp.uptrace.dev"),
		otlploghttp.WithHeaders(map[string]string{
			"uptrace-dsn": dsn,
		}),
		otlploghttp.WithCompression(otlploghttp.GzipCompression),
	)
	if err != nil {
		panic(err)
	}

	bsp := sdklog.NewBatchProcessor(exp,
		sdklog.WithMaxQueueSize(10_000),
		sdklog.WithExportMaxBatchSize(10_000),
		sdklog.WithExportInterval(10*time.Second),
		sdklog.WithExportTimeout(10*time.Second),
	)

	provider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(bsp),
		sdklog.WithResource(resource),
	)

	global.SetLoggerProvider(provider)

	return func() {
		provider.Shutdown(ctx)
	}
}

func configureTracing(ctx context.Context, dsn string, resource *resource.Resource) func() {
	exporter, err := otlptracehttp.New(
		ctx,
		otlptracehttp.WithEndpoint("otlp.uptrace.dev"),
		otlptracehttp.WithHeaders(map[string]string{
			"uptrace-dsn": dsn,
		}),
		otlptracehttp.WithCompression(otlptracehttp.GzipCompression),
	)
	if err != nil {
		panic(err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(exporter,
		sdktrace.WithMaxQueueSize(10_000),
		sdktrace.WithMaxExportBatchSize(10_000),
	)

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(resource),
		sdktrace.WithIDGenerator(xray.NewIDGenerator()),
	)
	tracerProvider.RegisterSpanProcessor(bsp)

	otel.SetTracerProvider(tracerProvider)

	return func() {
		tracerProvider.Shutdown(ctx)
	}
}
```

## Serverless

### AWS Lambda

See [OpenTelemetry Go Lambda](instrument/opentelemetry-go-lambda.md).

### Vercel

On [Vercel](https://vercel.com/docs/runtimes#official-runtimes/go), you need to configure OpenTelemetry in the `init` function and `ForceFlush` spans when the Vercel handler exits.

```go
package handler

import (
	"fmt"
	"net/http"

    "go.opentelemetry.io/otel"
	"github.com/uptrace/uptrace-go/uptrace"
)

var tracer = otel.Tracer("app_or_package_name")

func init() {
	uptrace.ConfigureOpentelemetry(...)
}

func Handler(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()

	// Flush buffered spans.
	defer uptrace.ForceFlush(ctx)

	ctx, span := tracer.Start(ctx, "handler-name")
	defer span.End()

	fmt.Fprintf(w, "<h1>Hello from Go!</h1>")
}
```

## Sampling

You can reduce the number of created (sampled) spans by configuring [head-based sampling](https://uptrace.dev/opentelemetry/sampling.html#head-based-sampling):

```go
import "go.opentelemetry.io/contrib/samplers/probability/consistent"

sampler := consistent.ParentProbabilityBased(
	consistent.ProbabilityBased(0.5), // sample 50% of traces
)

uptrace.ConfigureOpentelemetry(
	uptrace.WithTraceSampler(sampler),

	// Other options
)
```

By default, uptrace-go samples all spans.

## Resource detectors

By default, uptrace-go uses host and environment resource detectors, but you can configure it to use additional detectors, for example:

```go:no-v-pre
import (
	"github.com/uptrace/uptrace-go/uptrace"
	"go.opentelemetry.io/contrib/detectors/aws/ec2"
)

uptrace.ConfigureOpentelemetry(
	// copy your project DSN here or use UPTRACE_DSN env var
	//uptrace.WithDSN("{{ dsn }}"),

	uptrace.WithServiceName("myservice"),
	uptrace.WithServiceVersion("1.0.0"),

	uptrace.WithResourceDetectors(ec2.NewResourceDetector()),
)
```

::: details AWS

See [AWS detectors](https://github.com/open-telemetry/opentelemetry-go-contrib/tree/main/detectors/aws).

**EC2**

```go
import "go.opentelemetry.io/contrib/detectors/aws/ec2"

ec2ResourceDetector := ec2.NewResourceDetector()
```

**ECS**

```go
import "go.opentelemetry.io/contrib/detectors/aws/ecs"

ecsResourceDetector := ecs.NewResourceDetector()
```

**EKS**

```go
import "go.opentelemetry.io/contrib/detectors/aws/eks"

eksResourceDetector := eks.NewResourceDetector()
```

:::

::: details Google Cloud

See [GCP detectors](https://github.com/open-telemetry/opentelemetry-go-contrib/tree/main/detectors/gcp).

**Cloud Run**

```go
import "go.opentelemetry.io/contrib/detectors/gcp"

cloudRunResourceDetector := gcp.NewCloudRun()
```

**GCE**

```go
import "go.opentelemetry.io/contrib/detectors/gcp"

gceResourceDetector := gcp.GCE{}
```

**GKE**

```go
import "go.opentelemetry.io/contrib/detectors/gcp"

gkeResourceDetector := gcp.GKE{}
```

:::

## Errors monitoring

To monitor errors with a stack trace, use the `RecordError` API:

```go
import (
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
)

ctx, span := tracer.Start(ctx, "operation-name")
defer span.End()

span.RecordError(errors.New("oh my"), trace.WithStackTrace(true))
span.SetStatus(codes.Error, err.Error())
```

See [OpenTelemetry Go Tracing API](https://uptrace.dev/opentelemetry/go-tracing.html) for details.

## Logs monitoring

To monitor logs, use OpenTelemetry instrumentations for popular logging libraries:

- [OpenTelemetry Zap](instrument/opentelemetry-zap.md)
- [OpenTelemetry Logrus](instrument/opentelemetry-logrus.md)

If that is not possible, see [Monitoring Logs](logging.md) for more options such as Vector or FluentBit.

## SDK logging

By default, OpenTelemetry Go SDK logs error messages to stderr. You can discard or redirect those logs by providing an error handler:

```go
import "go.opentelemetry.io/otel"

otel.SetErrorHandler(otel.ErrorHandlerFunc(func(err error) {
    // ignore the error
}))
```

## What's next?

!!!include(next-go.md)!!!

- [OpenTelemetry net/http](instrument/opentelemetry-net-http.md)
- [OpenTelemetry Go gRPC](instrument/opentelemetry-go-grpc.md)
- [OpenTelemetry database sql](instrument/opentelemetry-database-sql.md)

<script type="ts">
import { defineComponent  } from 'vue'

import { useProjectPicker } from '@/use/org'

export default defineComponent({
  setup() {
    const { projects, activeProject, dsn } = useProjectPicker()
    return { projects, activeProject, dsn }
  },
})
</script>

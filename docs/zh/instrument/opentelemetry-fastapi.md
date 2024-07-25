---
title: OpenTelemetry FastAPI monitoring
description: Monitor your FastAPI application performance using OpenTelemetry FastAPI instrumentation.
keywords:
  - opentelemetry fastapi
  - fastapi opentelemetry
  - otel fastapi
---

# Monitor FastAPI with OpenTelemetry

![OpenTelemetry FastAPI](/cover/opentelemetry-fastapi.png)

By integrating OpenTelemetry with FastAPI, you can gain valuable insight into the performance, behavior and dependencies of your API. You can monitor and troubleshoot issues, optimize performance, and ensure the reliability of your FastAPI applications.

[[toc]]

## What is FastAPI?

FastAPI is a modern, high-performance web framework for building APIs with Python. It is designed to be easy to use, highly efficient, and able to handle high loads.

FastAPI's combination of performance, productivity, and modern features has made it popular among developers building APIs with Python.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-3.md)!!!

OpenTelemetry provides detailed instrumentation, enabling you to monitor and measure the performance of your FastAPI applications in real-time. You can identify bottlenecks, optimize code, and ensure your application runs smoothly even under heavy traffic.

## FastAPI instrumentation

To install OpenTelemetry instrumentation for FastAPI:

```shell
pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-fastapi
```

## OpenTelemetry SDK

To initialize OpenTelemetry in your Flask application, add the following to your application's startup code, for example, in your `app.py` or `wsgi.py` file:

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
    ConsoleSpanExporter,
)

provider = TracerProvider()
processor = BatchSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(processor)

# Sets the global default tracer provider
trace.set_tracer_provider(provider)

# Creates a tracer from the global tracer provider
tracer = trace.get_tracer("my.tracer.name")
```

## Usage

To instrument FastAPI application:

```python
from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI()
FastAPIInstrumentor.instrument_app(app)
```

Also see [OpenTelemetry FastAPI example](https://github.com/uptrace/uptrace-python/tree/master/example/fastapi) at GitHub.

OpenTelemetry allows you to trace requests as they flow through your FastAPI application, providing a clear picture of how different components and services interact. This end-to-end tracing helps diagnose issues quickly and streamline troubleshooting.

Once your FastAPI application is instrumented with OpenTelemetry, you can use the observability data in a variety of ways. You can visualize distributed traces, analyze performance metrics, and gain insight into the behavior of your API using [OpenTelemetry backends](https://uptrace.dev/blog/opentelemetry-backend.html) such as Uptrace, Jaeger, Prometheus, or Grafana.

## Instrumenting your code

OpenTelemetry can automatically trace incoming HTTP requests to your FastAPI application. You can also create custom spans to trace specific parts of your code. For example:

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@app.get("/")
async def read_root():
    # Create a custom span
    with tracer.start_as_current_span("custom-span"):
        # Your code here
        return {"message": "Hello, World!"}
```

## What is Uptrace?

!!!include(what-is-uptrace-1.md)!!!

### uvicorn

If you are using uvicorn with Gunicorn, you need to initialize OpenTelemetry in the post-fork hook:

```python
import uptrace

def post_fork(server, worker):
    uptrace.configure_opentelemetry(...)

workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
```

See [Application servers](../opentelemetry-python.md#application-servers) for details.

## Conclusion

With insights from OpenTelemetry, you can make informed decisions about scaling your FastAPI application. Load balancing strategies can be adjusted based on real-time data to handle traffic spikes effectively.

OpenTelemetry also allows you to instrument specific parts of your code for custom telemetry collection. You can use [OpenTelemetry Python APIs](https://uptrace.dev/opentelemetry/python-tracing.html) to manually create spans and add custom attributes, events, or metrics to capture additional information.

- [OpenTelemetry Flask](opentelemetry-flask.md)
- [OpenTelemetry Pyramid](opentelemetry-pyramid.md)

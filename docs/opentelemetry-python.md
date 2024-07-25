# OpenTelemetry Python distro for Uptrace

<a href="https://github.com/uptrace/uptrace-python" target="_blank">
  <img src="/devicon/python-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry Python SDK to export spans and metrics to Uptrace using OTLP/HTTP.

To learn about OpenTelemetry API, see [OpenTelemetry Python Tracing API](https://uptrace.dev/opentelemetry/python-tracing.html) and [OpenTelemetry Python Metrics API](https://uptrace.dev/opentelemetry/python-metrics.html).

[[toc]]

## Uptrace Python

[uptrace-python](https://github.com/uptrace/uptrace-python) is a thin wrapper over [opentelemetry-python](https://github.com/open-telemetry/opentelemetry-python) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

To install uptrace-python:

```shell
pip install uptrace
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page. Add the following code to the app main file (manage.py for Django):

<!-- prettier-ignore -->
::: warning
Gunicorn and uWSGI servers require special care. See [application servers](#application-servers) for details.
:::

```python:no-v-pre
import uptrace
from opentelemetry import trace

# copy your project DSN here or use UPTRACE_DSN env var
uptrace.configure_opentelemetry(
  dsn="{{ dsn }}",
  service_name="myservice",
  service_version="1.0.0",
  deployment_environment="production",
)

tracer = trace.get_tracer("app_or_package_name", "1.0.0")
```

The following configuration options are supported.

| Option                   | Description                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dsn`                    | A data source that is used to connect to uptrace.dev. For example, `https://token@api.uptrace.dev/project_id`.                       |
| `service_name`           | `service.name` resource attribute. For example, `myservice`.                                                                         |
| `service_version`        | `service.version` resource attribute. For example, `1.0.0`.                                                                          |
| `deployment_environment` | `deployment.environment` resource attribute. For example, `production`.                                                              |
| `resource_attributes`    | Any other resource attributes.                                                                                                       |
| `resource`               | Resource contains attributes representing an entity that produces telemetry. Resource attributes are copied to all spans and events. |

!!!include(env-vars.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 1**. Install [uptrace-python](https://github.com/uptrace/uptrace-python):

```shell
pip install uptrace
```

- **Step 2**. Copy the [code](https://github.com/uptrace/uptrace-python/tree/master/example/basic) to `main.py` replacing the `<dsn>`:

<ProjectPicker v-model="activeProject" :projects="projects" />

```python:no-v-pre
#!/usr/bin/env python3

import logging

import uptrace
from opentelemetry import trace

# Configure OpenTelemetry with sensible defaults.
uptrace.configure_opentelemetry(
    # Set dsn or UPTRACE_DSN env var.
    dsn="{{ dsn }}",
    service_name="myservice",
    service_version="1.0.0",
)

# Create a tracer. Usually, tracer is a global variable.
tracer = trace.get_tracer("app_or_package_name", "1.0.0")

# Create a root span (a trace) to measure some operation.
with tracer.start_as_current_span("main-operation") as main:
    with tracer.start_as_current_span("GET /posts/:id") as child1:
        child1.set_attribute("http.method", "GET")
        child1.set_attribute("http.route", "/posts/:id")
        child1.set_attribute("http.url", "http://localhost:8080/posts/123")
        child1.set_attribute("http.status_code", 200)
        child1.record_exception(ValueError("error1"))

    with tracer.start_as_current_span("SELECT") as child2:
        child2.set_attribute("db.system", "mysql")
        child2.set_attribute("db.statement", "SELECT * FROM posts LIMIT 100")

    logging.error("Jackdaws love my big sphinx of quartz.")

    print("trace:", uptrace.trace_url(main))

# Send buffered spans and free resources.
uptrace.shutdown()
```

- **Step 3**. Run the code to get a link for the generated trace:

```shell
python3 main.py
trace: https://uptrace.dev/traces/<trace_id>
```

- **Step 4**. Follow the link to view the trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-python/tree/master/example/otlp-traces) is how you can export OpenTelemetry traces to Uptrace following the recommendations above:

```python
#!/usr/bin/env python3

import os

import grpc
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
    OTLPSpanExporter,
)
from opentelemetry.sdk.extension.aws.trace import AwsXRayIdGenerator

dsn = os.environ.get("UPTRACE_DSN")
print("using DSN:", dsn)

resource = Resource(
    attributes={"service.name": "myservice", "service.version": "1.0.0"}
)
tracer_provider = TracerProvider(
    resource=resource,
    id_generator=AwsXRayIdGenerator(),
)
trace.set_tracer_provider(tracer_provider)

exporter = OTLPSpanExporter(
    endpoint="otlp.uptrace.dev:4317",
    # Set the Uptrace dsn here or use UPTRACE_DSN env var.
    headers=(("uptrace-dsn", dsn),),
    timeout=5,
    compression=grpc.Compression.Gzip,
)

span_processor = BatchSpanProcessor(
    exporter,
    max_queue_size=1000,
    max_export_batch_size=1000,
)
tracer_provider.add_span_processor(span_processor)

tracer = trace.get_tracer("app_or_package_name", "1.0.0")

with tracer.start_as_current_span("main") as span:
    trace_id = span.get_span_context().trace_id
    print(f"trace id: {trace_id:0{32}x}")

# Send buffered spans.
trace.get_tracer_provider().shutdown()
```

### Exporting metrics

[Here](https://github.com/uptrace/uptrace-python/tree/master/example/otlp-metrics) is how you can export OpenTelemetry metrics to Uptrace following the recommendations above:

```python
#!/usr/bin/env python3

import os
import time

import grpc
from opentelemetry import metrics
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import (
    OTLPMetricExporter,
)
from opentelemetry.sdk import metrics as sdkmetrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import (
    AggregationTemporality,
    PeriodicExportingMetricReader,
)
from opentelemetry.sdk.resources import Resource

dsn = os.environ.get("UPTRACE_DSN")
print("using DSN:", dsn)

temporality_delta = {
    sdkmetrics.Counter: AggregationTemporality.DELTA,
    sdkmetrics.UpDownCounter: AggregationTemporality.DELTA,
    sdkmetrics.Histogram: AggregationTemporality.DELTA,
    sdkmetrics.ObservableCounter: AggregationTemporality.DELTA,
    sdkmetrics.ObservableUpDownCounter: AggregationTemporality.DELTA,
    sdkmetrics.ObservableGauge: AggregationTemporality.DELTA,
}

exporter = OTLPMetricExporter(
    endpoint="otlp.uptrace.dev:4317",
    headers=(("uptrace-dsn", dsn),),
    timeout=5,
    compression=grpc.Compression.Gzip,
    preferred_temporality=temporality_delta,
)
reader = PeriodicExportingMetricReader(exporter)

resource = Resource(
    attributes={"service.name": "myservice", "service.version": "1.0.0"}
)
provider = MeterProvider(metric_readers=[reader], resource=resource)
metrics.set_meter_provider(provider)

meter = metrics.get_meter("github.com/uptrace/uptrace-python", "1.0.0")
counter = meter.create_counter("some.prefix.counter", description="TODO")

while True:
    counter.add(1)
    time.sleep(1)
```

### Exporting logs

[Here](https://github.com/uptrace/uptrace-python/tree/master/example/otlp-logs) is how you can export OpenTelemetry logs to Uptrace following the recommendations above:

```python
#!/usr/bin/env python3

import os
import logging

import grpc
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import (
    OTLPLogExporter,
)
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

dsn = os.environ.get("UPTRACE_DSN")
print("using DSN:", dsn)

resource = Resource(
    attributes={"service.name": "myservice", "service.version": "1.0.0"}
)
logger_provider = LoggerProvider(resource=resource)
set_logger_provider(logger_provider)

exporter = OTLPLogExporter(
    endpoint="otlp.uptrace.dev:4317",
    headers=(("uptrace-dsn", dsn),),
    timeout=5,
    compression=grpc.Compression.Gzip,
)
logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)
logging.getLogger().addHandler(handler)

logger = logging.getLogger("myapp.area1")
logger.error("Hyderabad, we have a major problem.")

logger_provider.shutdown()
```

## Logging level

By default, OpenTelemetry logging handler uses `logging.NOTSET` level which defaults to `WARNING` level. You can override the level when configuring OpenTelemetry:

```python
import logging

uptrace.configure_opentelemetry(
    ...
    logging_level=logging.ERROR,
)
```

You can also specify the logging level when you create a logger:

```python
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
```

## Async functions

If you are using asynchronous Python functions, use the following decorator to start spans:

```python
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from opentelemetry.trace import Tracer


@asynccontextmanager
async def start_as_current_span_async(
    *args: Any,
    tracer: Tracer,
    **kwargs: Any,
) -> AsyncGenerator[None, None]:
    """Start a new span and set it as the current span.

    Args:
        *args: Arguments to pass to the tracer.start_as_current_span method
        tracer: Tracer to use to start the span
        **kwargs: Keyword arguments to pass to the tracer.start_as_current_span method

    Yields:
        None
    """
    with tracer.start_as_current_span(*args, **kwargs):
        yield
```

You can use it like this:

```python
from opentelemetry.trace import get_tracer

tracer = get_tracer(__name__)

@start_as_current_span_async(tracer=tracer, name='my_func')
async def my_func() -> ...:
    ...
```

That is a temporal solution until [#3270](https://github.com/open-telemetry/opentelemetry-python/issues/3270) and [#3271](https://github.com/open-telemetry/opentelemetry-python/issues/3271) issues are resolved.

## Application servers

Because `BatchSpanProcessor` spawns a background thread to export spans to [OpenTelemetry backends](https://uptrace.dev/blog/opentelemetry-backend.html), it does not work well with application servers like Gunicorn and uWSGI that use the pre-forking model to serve requests. During the fork, the child process inherits the lock held by the parent process and a deadlock occurs.

To workaround that issue, you should configure OpenTelemetry from post-fork hooks provided by [Gunicorn](#gunicorn) and [uWSGI](#uwsgi).

### Gunicorn

With Gunicorn, use the [post_fork](https://docs.gunicorn.org/en/stable/settings.html#post-fork) hook:

```python
import uptrace

def post_fork(server, worker):
    uptrace.configure_opentelemetry(...)
```

See [flask-gunicorn](https://github.com/uptrace/uptrace-python/tree/master/example/flask-gunicorn) as an example.

#### uvicorn

If you are using Gunicorn + uvicorn with async frameworks like [FastAPI](instrument/opentelemetry-fastapi.md):

```python
import uptrace

def post_fork(server, worker):
    uptrace.configure_opentelemetry(...)

workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
```

### uWSGI

With uWSGI, use the [postfork](https://uwsgi-docs.readthedocs.io/en/latest/PythonDecorators.html#uwsgidecorators.postfork) decorator:

```python
from uwsgidecorators import postfork
import uptrace

@postfork
def init_tracing():
    uptrace.configure_opentelemetry(...)
```

See [flask-uwsgi](https://github.com/uptrace/uptrace-python/tree/master/example/flask-uwsgi) as an example.

## SSL errors

If you are getting SSL errors like this:

```
ssl_transport_security.cc:1468] Handshake failed with fatal error SSL_ERROR_SSL: error:1000007d:SSL routines:OPENSSL_internal:CERTIFICATE_VERIFY_FAILED
```

Try to use different root certificates as a [workaround](https://github.com/grpc/grpc/issues/27727):

```shell
export GRPC_DEFAULT_SSL_ROOTS_FILE_PATH=/etc/ssl/certs/ca-certificates.crt
```

## What's next?

!!!include(next-python.md)!!!

- [OpenTelemetry Django](instrument/opentelemetry-django.html)
- [OpenTelemetry Flask](instrument/opentelemetry-flask.html)
- [OpenTelemetry FastAPI](instrument/opentelemetry-fastapi.html)

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

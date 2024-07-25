---
title: OpenTelemetry Flask monitoring
description: Learn how to use OpenTelemetry to monitor Flask applications.
keywords:
  - opentelemetry flask
  - flask opentelemetry
  - opentelemetry flask instrumentation
---

# Monitor Flask performance with OpenTelemetry

![OpenTelemetry Flask](/cover/opentelemetry-flask.png)

By integrating OpenTelemetry with Flask, you can gain valuable insight into the performance, behavior, and dependencies of your application.

Using OpenTelemetry, you can monitor and troubleshoot issues, optimize performance, and ensure the reliability of your Flask applications.

[[toc]]

## What is Flask?

Flask is a lightweight and popular web framework written in Python. It is designed to be simple, flexible, and easy to use, providing the essentials for building web applications without imposing rigid structures or dependencies.

Flask's simplicity and flexibility make it ideal for building small to medium-sized applications, RESTful APIs, or prototypes.

Flask's minimalist approach gives developers fine-grained control over their application's architecture, allowing them to choose the best libraries and tools for their specific needs.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-2.md)!!!

## Flask instrumentation

OpenTelemetry provides instrumentations for various libraries and frameworks, including Flask. To instrument your Flask app, you need to install the corresponding OpenTelemetry Flask instrumentation:

You can use pip to install these packages:

```shell
pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-flask
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

After initializing OpenTelemetry Python SDK, you can instrument your Flask app:

```python
from opentelemetry.instrumentation.flask import FlaskInstrumentor

app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)
```

You can optionally configure Flask instrumentation to enable sqlcommenter, which adds contextual information to queries:

```python
from opentelemetry.instrumentation.flask import FlaskInstrumentor

FlaskInstrumentor().instrument(enable_commenter=True, commenter_options={})
```

See [example](https://github.com/uptrace/uptrace-python/tree/master/example/flask) for details.

## Instrumenting your code

OpenTelemetry can automatically trace incoming HTTP requests to your Flask application. You can also create custom spans to trace specific parts of your code.

For example:

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@app.route('/')
def index():
    # Create a custom span
    with tracer.start_as_current_span("custom-span"):
        # Your code here
    return "Hello, World!"
```

See [OpenTelemetry Python Tracing API](https://uptrace.dev/opentelemetry/python-tracing.html) for details.

## Instrumenting SQLAlchemy

To instrument SQLAlchemy database client, you need to install the corresponding SQLAlchemy instrumentation:

```shell
pip install opentelemetry-instrumentation-sqlalchemy
```

Then instrument the db engine:

```python
from flask_sqlalchemy import SQLAlchemy
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
db = SQLAlchemy(app)
SQLAlchemyInstrumentor().instrument(engine=db.engine)
```

See [Instrumenting SQLAlchemy with OpenTelemetry](opentelemetry-sqlalchemy.md) for details.

Once your Flask application is instrumented with OpenTelemetry, you can use the observability data in a variety of ways.

You can visualize distributed traces, analyze performance metrics, and gain insight into the behavior of your application using [OpenTelemetry backends](https://uptrace.dev/blog/opentelemetry-backend.html), such as Uptrace, Jaeger, Prometheus, or Grafana.

## What is Uptrace?

!!!include(what-is-uptrace-2.md)!!!

## What's next?

!!!include(next-python.md)!!!

More Flask examples:

- [Flask](https://github.com/uptrace/uptrace-python/tree/master/example/flask)
- [Flask auto-instrumentation](https://github.com/uptrace/uptrace-python/tree/master/example/flask-auto-instrumentation)
- [Flask and Gunicorn](https://github.com/uptrace/uptrace-python/tree/master/example/flask-gunicorn)
- [Flask and uWSGI](https://github.com/uptrace/uptrace-python/tree/master/example/flask-uwsgi)

Popular instrumentations:

- [OpenTelemetry Django](opentelemetry-django.md)
- [OpenTelemetry FastAPI](opentelemetry-fastapi.md)

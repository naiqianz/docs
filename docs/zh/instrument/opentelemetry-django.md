---
title: OpenTelemetry Django monitoring
description: OpenTelemetry Django instrumentation can help developers gain visibility into their applications' performance and behavior, allowing them to identify and fix issues more quickly.
keywords:
  - opentelemetry django
  - otel django
  - opentelemetry django postgresql
  - opentelemetry django mysql
  - opentelemetry-instrumentation-django
---

# Monitor Django with OpenTelemetry

![OpenTelemetry Django](/cover/opentelemetry-django.png)

You can use OpenTelemetry Django to instrument and collect telemetry data such as request and response times, database query times, and other custom metrics.

By incorporating OpenTelemetry, you can capture telemetry data such as distributed traces and metrics, and send it to various backends for analysis and visualization.

[[toc]]

## What is Django?

Django is an open-source, high-level web framework written in Python. It follows the Model-View-Controller (MVC) architectural pattern and provides a set of tools and features that simplify and accelerate web application development.

Django is designed to promote clean, maintainable code and follows the principle of "Don't Repeat Yourself" (DRY), which emphasizes code reusability and reducing redundancy.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-6.md)!!!

## OpenTelemetry Django

OpenTelemetry provides Python instrumentation packages for various Django components such as Django views, Django database queries, Django templates, and more.

To instrument Django app, you need to install the corresponding OpenTelemetry Django instrumentation:

```shell
pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-django
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

Django instrumentation uses `DJANGO_SETTINGS_MODULE` env variable to find settings file. Django defines that variable in `manage.py` file so you should instrument Django app from that file:

```python
# manage.py

from opentelemetry.instrumentation.django import DjangoInstrumentor

def main():
    # DjangoInstrumentor uses DJANGO_SETTINGS_MODULE to instrument the project.
    # Make sure the var is available before you call the DjangoInstrumentor.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

    DjangoInstrumentor().instrument()
```

See [example](https://github.com/uptrace/uptrace-python/tree/master/example/django) for details.

## Instrumenting your code

OpenTelemetry can automatically trace incoming HTTP requests to your Django application. You can also create custom spans to trace specific parts of your code, for example:

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

def my_view(request):
    # Create a custom span
    with tracer.start_as_current_span("custom-span"):
        # Your code here
    return HttpResponse("Hello, World!")
```

### uWSGI

If you are using Django with uWSGI, you should use the post-fork hook to initialize OpenTelemetry, for example, in your `main.py`:

```python
from uwsgidecorators import postfork
import uptrace
from opentelemetry.instrumentation.django import DjangoInstrumentor

@postfork
def init_tracing():
    uptrace.configure_opentelemetry(
        # Set dsn or use UPTRACE_DSN env var.
        #dsn="",
        service_name="app_or_service_name",
        service_version="1.0.0",
    )
    DjangoInstrumentor().instrument()
```

### Gunicorn

If you are using Django with Gunicorn, you should use the post-fork hook to initialize OpenTelemetry, for example, in `gunicorn.config.py`:

```python
import uptrace
from opentelemetry.instrumentation.django import DjangoInstrumentor

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

    uptrace.configure_opentelemetry(
        # Set dsn or use UPTRACE_DSN env var.
        #dsn="",
        service_name="app_or_service_name",
        service_version="1.0.0",
    )
    DjangoInstrumentor().instrument()
```

## Instrumenting database engine

### PostgreSQL

You can configure Django to use PostgreSQL by changing `settings.py`:

```shell
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'mydatabaseuser',
        'PASSWORD': 'mypassword',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
```

Internally, `postgresql'` engine uses psycopg2 library. To instrument `psycopg2`, you need the corresponding instrumentation:

```shell
pip install opentelemetry-instrumentation-psycopg2
```

Then actually instrument the library from the main function:

```python
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor

Psycopg2Instrumentor().instrument()
```

If you are using [Gunicorn](#gunicorn) or [uWSGI](#uwsgi), you should instrument the library from post-fork hooks.

### MySQL

You can configure Django to use MySQL by changing `settings.py`:

```shell
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydatabase',
        'USER': 'mydatabaseuser',
        'PASSWORD': 'mypassword',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

Internally, `mysql` engine uses [mysqlclient](https://pypi.org/project/mysqlclient/) library that implements Python Database API. To instrument any library that uses Python DB API, you need to install `opentelemetry-instrumentation-dbapi` instrumentation:

```shell
pip install opentelemetry-instrumentation-dbapi
```

Then instrument the `mysqlclient` library from the main function:

```python
import MySQLdb
from opentelemetry.instrumentation.dbapi import trace_integration

trace_integration(MySQLdb, "connect", "mysql")
```

If you are using [Gunicorn](#gunicorn) or [uWSGI](#uwsgi), you should instrument the library from post-fork hooks.

### SQLite

You can configure Django to use SQLite by changing `settings.py`:

```shell
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

Internally, `sqlite3` Django engine uses [sqlite3](https://docs.python.org/3/library/sqlite3.html) Python library. To instrument `sqlite3`, you need a corresponding instrumentation:

```shell
pip install opentelemetry-instrumentation-sqlite3
```

Then actually instrument the `sqlite3` library from the main function:

```python
from opentelemetry.instrumentation.sqlite3 import SQLite3Instrumentor

SQLite3Instrumentor().instrument()
```

If you are using [Gunicorn](#gunicorn) or [uWSGI](#uwsgi), you should instrument the library from post-fork hooks.

## Performance hit

OpenTelemetry aims to be efficient and lightweight, but it does introduce some overhead due to the instrumentation and telemetry collection.

The performance impact of OpenTelemetry on Django depends on factors such as the amount of telemetry collected, the exporters used, the sampling configuration, and the resources available on the system.

OpenTelemetry allows you to configure sampling to control the amount of telemetry data collected. Adjusting the sampling rate can reduce the volume of data and help improve performance.

## What is Uptrace?

!!!include(what-is-uptrace-3.md)!!!

## What's next?

By integrating OpenTelemetry with Django, you can gain valuable insight into the performance, behavior, and dependencies of your application. You can monitor and troubleshoot issues, optimize performance, and ensure the reliability of your Django applications.

!!!include(next-python.md)!!!

- [OpenTelemetry Flask](opentelemetry-flask.md)
- [OpenTelemetry FastAPI](opentelemetry-fastapi.md)

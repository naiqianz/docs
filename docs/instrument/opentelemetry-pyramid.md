---
title: OpenTelemetry Pyramid monitoring
description: OpenTelemetry Pyramid is an implementation of the OpenTelemetry specification for Pyramid framework.
keywords:
  - opentelemetry pyramid
  - otel pyramid
  - opentelemetry pylons
---

<CoverImage title="Monitor Pyramid performance with OpenTelemetry" />

OpenTelemetry Pyramid is an implementation of the OpenTelemetry specification for Pyramid framework. It provides a middleware that can be used to automatically generate traces for incoming requests and outgoing responses.

Pyramid is a free, open-source web framework for building web applications in Python. It was previously known as Pylons and was later rebranded as Pyramid.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## Pyramid instrumentation

To use OpenTelemetry with Pyramid, you need to install the `opentelemetry.instrumentation.pyramid` package.

```shell
pip install opentelemetry-instrumentation-pyramid
```

## Usage

Here's an example of how to configure Pyramid with OpenTelemetry using the Uptrace backend:

```python
from opentelemetry.instrumentation.pyramid import PyramidInstrumentor
import uptrace

if __name__ == "__main__":
    uptrace.configure_opentelemetry(
        # Set dsn or UPTRACE_DSN env var.
        # dsn="",
        service_name="myservice",
        service_version="1.0.0",
    )
    PyramidInstrumentor().instrument()

    with Configurator() as config:
        config.add_route("home", "/")
        config.scan()

        app = config.make_wsgi_app()

    print("listening on http://localhost:6543")
    server = make_server("0.0.0.0", 6543, app)
    server.serve_forever()
```

See the [example](https://github.com/uptrace/uptrace-python/tree/master/example/pyramid) on GitHub for more details.

## What is Uptrace?

!!!include(what-is-uptrace-6.md)!!!

## Excluding URLs

You can disable tracing on certain URLs by providing an environment variable with the list of URLs, for example, the following config will exclude URLs like `https://site/client/123/info` and `https://site/xyz/healthcheck`:

```shell
export OTEL_PYTHON_PYRAMID_EXCLUDED_URLS="client/.*/info,healthcheck"
```

See [documentation](https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/pyramid/pyramid.html) for details.

## Headers

To capture HTTP request headers, set the environment variable to a comma delimited list of HTTP header names:

```shell
# list of headers
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_REQUEST="content-type,custom_request_header"

# regexp
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_REQUEST="Accept.*,X-.*"

# all headers
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_REQUEST=".*"
```

To capture HTTP response headers:

```shell
# list of headers
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_RESPONSE="content-type,custom_response_header"

# regexp
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_RESPONSE="Content.*,X-.*"

# all headers
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SERVER_RESPONSE=".*"
```

You can also sanitize captured headers to prevent storing sensitive data:

```shell
export OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_SANITIZE_FIELDS=".*session.*,set-cookie"
```

See [documentation](https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/pyramid/pyramid.html) for details.

## What's next?

!!!include(next-python.md)!!!

- [OpenTelemetry Flask](opentelemetry-flask.md)
- [OpenTelemetry FastAPI](opentelemetry-fastapi.md)

---
title: OpenTelemetry Falcon
description: OpenTelemetry Falcon instrumentation can help developers gain visibility into their applications' performance and behavior, allowing them to identify and fix issues more quickly.
keywords:
  - opentelemetry falcon
  - otel falcon
  - opentelemetry-instrumentation-falcon
---

<CoverImage title="Monitor Falcon with OpenTelemetry" />

Falcon is a minimalist web framework for building RESTful APIs in Python. It is lightweight, fast, and designed to be easy to use.

By integrating OpenTelemetry into your Falcon application, you can capture and export telemetry data such as traces, metrics, and logs. You can use that data for monitoring, troubleshooting, and analyzing the behavior and performance of your application.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## OpenTelemetry Falcon

To instrument Falcon app, you need to install the corresponding OpenTelemetry Falcon instrumentation:

```shell
pip install opentelemetry-instrumentation-falcon
```

## Usage

Use the following code to integrate OpenTelemetry to capture telemetry data from your Falcon application:

```python
from falcon import API
from opentelemetry.instrumentation.falcon import FalconInstrumentor

FalconInstrumentor().instrument()

app = falcon.API()

class HelloWorldResource(object):
    def on_get(self, req, resp):
        resp.body = 'Hello World'

app.add_route('/hello', HelloWorldResource())
```

You can exclude certain URLs from being tracked using environment variables:

```shell
# excludes requests such as `https://site/client/123/info` and `https://site/xyz/healthcheck`
export OTEL_PYTHON_FALCON_EXCLUDED_URLS="client/.*/info,healthcheck"
```

You can also extract certain attributes from Falcon’s request object and use them as span attributes:

```shell
export OTEL_PYTHON_FALCON_TRACED_REQUEST_ATTRS='query_string,uri_template'
```

See [documentation](https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/falcon/falcon.html) for more details.

## Hooks

You can specify request and response hooks:

```python
# the hook is called right after a Span is created
def request_hook(span, req):
    pass

# the hook is called right before the span is finished
def response_hook(span, req, resp):
    pass

FalconInstrumentation().instrument(request_hook=request_hook, response_hook=response_hook)
```

## What is Uptrace?

!!!include(what-is-uptrace-7.md)!!!

## What's next?

!!!include(next-python.md)!!!

- [OpenTelemetry Pyramid](opentelemetry-pyramid.md)
- [OpenTelemetry SQLAlchemy](opentelemetry-sqlalchemy.md)

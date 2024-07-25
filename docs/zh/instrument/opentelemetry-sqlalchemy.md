---
title: OpenTelemetry SQLAlchemy monitoring
---

<CoverImage title="Monitor SQLAlchemy performance with OpenTelemetry" />

SQLAlchemy is an Object Relational Mapper for Python that gives application developers the full power and flexibility of SQL.

In this article you will learn how to monitor and optimize SQLAlchemy performance using OpenTelemetry observability framework.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## SQLAlchemy instrumentation

To install OpenTelemetry instrumentation for SQLAlchemy:

```shell
pip install opentelemetry-instrumentation-sqlalchemy
```

## Usage

To instrument sqlalchemy database client:

```python
from sqlalchemy import create_engine
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

engine = create_engine("sqlite:///:memory:")
SQLAlchemyInstrumentor().instrument(engine=engine)
```

## What is Uptrace?

!!!include(what-is-uptrace-2.md)!!!

## What's next

!!!include(next-python.md)!!!

Popular instrumentations:

- [OpenTelemetry Pyramid](opentelemetry-pyramid.md)
- [OpenTelemetry FastAPI](opentelemetry-fastapi.md)

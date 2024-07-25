---
title: OpenTelemetry Instrumentations
---

# OpenTelemetry Instrumentations

![OpenTelemetry Instrumentations](/instrument/opentelemetry-instrumentations.png)

OpenTelemetry aims to provide a consistent and unified way to instrument, generate, collect, and export telemetry data regardless of the underlying vendor or technology stack.

Instrumentations are plugins for popular frameworks and libraries that use OpenTelemetry API to record important operations, for example, HTTP requests, DB queries, logs, errors, and more.

OpenTelemetry supports multiple programming languages and frameworks, and it can integrate with various observability tools and vendors, including popular [distributed tracing tools](https://uptrace.dev/blog/distributed-tracing-tools.html).

[[toc]]

## What to instrument?

You don't need to instrument all operations to get the most out of tracing. It can take a lot of time and usually is not needed. Consider prioritizing the following operations:

- **Network calls**, for example, HTTP requests or RPC calls.
- **Disk operations**, for example, reading/writing to files.
- **Database queries** which combine network and filesystem operations.
- **Errors and logs**, for example, using [structured logging](https://uptrace.dev/blog/structured-logging.html).

## Instrumentations

You can find more OpenTelemetry instrumentations in the official [registry](https://opentelemetry.io/registry/).

### Go

- [otelhttp: OpenTelemetry net/http](opentelemetry-net-http.md)
- [otelgrpc: OpenTelemetry Go gRPC](opentelemetry-go-grpc.md)
- [otelgin: OpenTelemetry Gin](opentelemetry-gin.md)
- [otelbeego: OpenTelemetry Beego](opentelemetry-beego.md)
- [otelmux: OpenTelemetry Gorilla Mux](opentelemetry-gorilla-mux.md)
- [otelecho: OpenTelemetry Labstack Echo](opentelemetry-echo.md)
- [otelgorm: OpenTelemetry GORM](opentelemetry-gorm.md)
- [otelent: OpenTelemetry Ent](opentelemetry-ent.md)
- [otelsql: OpenTelemetry database/sql](opentelemetry-database-sql.md)
- [otelslog: OpenTelemetry Slog](opentelemetry-slog.md)
- [otelzap: OpenTelemetry Zap](opentelemetry-zap.md)
- [otellogrus: OpenTelemetry Logrus](opentelemetry-logrus.md)
- [otelzero: OpenTelemetry Go Zero](opentelemetry-go-zero.md)
- [OpenTelemetry Go Lambda](opentelemetry-go-lambda.md)

### Python

- [OpenTelemetry Django](opentelemetry-django.md)
- [OpenTelemetry Flask](opentelemetry-flask.md)
- [OpenTelemetry FastAPI](opentelemetry-fastapi.md)
- [OpenTelemetry Pyramid](opentelemetry-pyramid.md)
- [OpenTelemetry SQLAlchemy](opentelemetry-sqlalchemy.md)
- [OpenTelemetry Falcon](opentelemetry-falcon.md)

### Ruby

- [OpenTelemetry Ruby On Rails](opentelemetry-rails.md)
- [OpenTelemetry Sinatra](opentelemetry-sinatra.md)

### Node.js

- [OpenTelemetry Express.js](opentelemetry-express.md)
- [OpenTelemetry Node.js Lambda](opentelemetry-node-lambda.md)

### Elixir

- [OpenTelemetry Phoenix](opentelemetry-phoenix.md)

### Java

- [OpenTelemetry Spring Boot](opentelemetry-spring-boot.html)

## Monitoring host metrics

To collect host-level metrics, you need to install and configure [OpenTelemetry Host Metrics](https://uptrace.dev/opentelemetry/collector-host-metrics.html) receiver that gathers various metrics about the host system, for example, CPU, RAM, disk metrics and other system-level metrics.

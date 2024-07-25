---
title: Grouping similar spans and events together
---

<CoverImage title="Grouping similar spans and events together" />

[[toc]]

## Span names

Uptrace uses span names and some attributes to group similar spans together. To group spans properly, give them short and concise names. The total number of unique span names should be less than 1000. Otherwise, you will have too many span groups and your experience may suffer.

The following names are **good** because they are short, distinctive, and help grouping similar spans together:

| Span name                             | Comment                                   |
| ------------------------------------- | ----------------------------------------- |
| `GET /projects/:id`                   | Good. A route name with param names.      |
| `select_project`                      | Good. A function name without arguments.  |
| `SELECT * FROM projects WHERE id = ?` | Good. A database query with placeholders. |

The following names are **bad** because they contain variable params and args:

| Span name                              | Comment                              |
| -------------------------------------- | ------------------------------------ |
| `GET /projects/42`                     | Bad. Contains a variable param `42`. |
| `select_project(42)`                   | Bad. Contains a variable `42`.       |
| `SELECT * FROM projects WHERE id = 42` | Bad. Contains a variable arg `42`.   |

## Display name

Because OpenTelemetry uses span and event names to group similar spans together, such names end up being not very descriptive, for example, SQL spans often have names like `SELECT` or `INSERT`.

This is where the `display.name` attribute comes in handy. The `display.name` is a human-readable string that provides a short summary of the operation that the span or event represents.

Uptrace doesn't use display names for grouping so they don't have the same limitations as span names. For example, a span representing a SQL query might have the following name and attributes:

```toml
SpanName = "SELECT"

display.name = "pg_select_items_from_group(123)"
db.system = "postgresql"
db.statement = "SELECT * FROM items WHERE group_id = 123 ORDER BY id LIMIT 100"
```

You can use `display.name` attribute with events too.

## Custom grouping

You can customize how Uptrace groups spans and events together by specifying the `grouping.fingerprint` attribute which can be a string or a number (hash). Uptrace will group spans/events with the same fingerprint together.

```toml
SpanName = "SELECT"

display.name = "pg_select_items_from_group(123)"
db.system = "postgresql"
db.statement = "SELECT * FROM items WHERE group_id = 123 ORDER BY id LIMIT 100"
grouping.finterprint = "select group items"
```

## Grouping settings

On the Project Settings page, there are several options that control how Uptrace groups spans together:

- Group spans with different `deployment.environment` attribute separately. After enabling this setting, there will be separate groups for spans with the same name but different environments.

- Group spans with `funcs` system and different `service.name` attribute separately. After enabling this setting, there will be a separate system for each service such as `funcs:service1` and `funcs:service2`.

## Span systems

Depending on the presence of some [semantic attributes](https://uptrace.dev/opentelemetry/attributes.html), Uptrace assigns each span a **system**, for example:

- `http:service_name` system for HTTP spans.
- `db:postgresql` for PostgreSQL queries.
- `log:error` for log messages with `ERROR` severity.
- `exceptions` for exceptions.

Using a system, you can easily filter spans that have the same set of attributes, for example, [all database spans](https://app.uptrace.dev/explore/1/groups?system=db:all).

### HTTP

To monitor HTTP clients and servers, use [HTTP semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/http.md).

A minimal HTTP server example:

```toml
SpanName = "GET /users/:id"
SpanKind = "server"

http.method = "GET"
http.route = "/users/:id"
```

A minimal HTTP client example:

```toml
SpanName = "GET /users/:id"
SpanKind = "client"

http.method = "GET"
http.route = "/users/:id"
```

### RPC

To monitor remote procedure calls, use [RPC semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/rpc.md).

A minimal RPC server example:

```toml
SpanName = "AuthService/Auth"
SpanKind = "server"

rpc.system = "grpc"
rpc.service = "AuthService.Auth"
rpc.method = "Auth"
```

### Database

To monitor database queries and Redis/memcached commands, use [DB semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/database.md).

A minimal DB example:

```toml
SpanName = "pg.query"
SpanKind = "client"

db.system = "postgresql"
db.statement = "SELECT * FROM users WHERE id = 123"
```

A minimal Redis command example:

```toml
SpanName = "GET"
SpanKind = "client"

db.system = "redis"
db.statement = "GET foo"
```

### Messages

To monitor producers and consumers (queues), use [Messaging semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/messaging.md).

A minimal producer example:

```toml
SpanName = "send MyQueue"
SpanKind = "producer"

messaging.system = "rabbitmq"
messaging.destination.name = "MyQueue"
messaging.destination.kind = "queue"
```

A minimal consumer example:

```toml
SpanName = "process MyQueue"
SpanKind = "consumer"

messaging.system = "rabbitmq"
messaging.operation = "process"
messaging.destination.name = "MyQueue"
messaging.destination.kind = "queue"
```

### Functions

To monitor functions, use [Source code attributes](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/span-general.md#source-code-attributes).

A minimal example:

```toml
SpanName = "org.FetchUser"

service.name = "myservice"
code.function = "org.FetchUser"
code.filepath = "org/user.go"
code.lineno = "123"
```

### Functions as a Service

To monitor serverless functions, use [FaaS semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/faas.md).

A minimal server example:

```toml
SpanName = "my-lambda-function"
SpanKind = "server"

faas.trigger = "http"
faas.name = "my-lambda-function"
```

A minimal client example:

```toml
SpanName = "my-lambda-function"
SpanKind = "client"

faas.trigger = "http"
faas.invoked_name = "my-lambda-function"
```

### Exceptions

To monitor errors and exceptions, use [Exceptions semantic convention](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/exceptions.md) and **events** API.

A minimal example:

```toml
EventName = "exception"

exception.type = "*exec.ExitError"
exception.message = "exit status 1"
exception.stack = "<exception stack>"
```

The same in Go programming language:

```go
span := trace.SpanFromContext(ctx)

span.AddEvent("exception", trace.WithAttributes(
    attribute.String("exception.type", "*exec.ExitError"),
    attribute.String("exception.message", "exit status 1"),
    attribute.String("exception.stack", string(runtime.Stack())),
))
```

You can also control how Uptrace groups exceptions together by specifying the `grouping.fingerprint` attribute which can be a string or a number (hash). Uptrace will group exceptions with the same fingerprint together.

```toml
EventName = "exception"

exception.type = "*exec.ExitError"
exception.message = "exit status 1"
grouping.fingerprint = "*exec.ExitError"
```

### Logs

A minimal example:

```toml
EventName = "log"

log.severity = "info"
log.message = "something failed"
log.params.key1 = "value1"
log.params.key2 = "value2"
```

The same in Go programming language:

```go
span := trace.SpanFromContext(ctx)

span.AddEvent("log", trace.WithAttributes(
	attribute.String("log.severity", "info"),
	attribute.String("log.message", "something failed"),
	attribute.String("log.params.key1", "value1"),
	attribute.String("log.params.key2", "value2"),
))
```

You can also control how Uptrace groups logs together by providing `grouping.fingerprint` attribute which can be a string or a number (hash):

```toml
EventName = "log"

log.severity = "info"
log.message = "unstructured log message 123 456 789"
grouping.fingerprint = "unstructured log message"
```

See [Monitoring Logs](logging.md) for details.

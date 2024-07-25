---
title: Contributing to Uptrace
---

<CoverImage title="Contributing to Uptrace" />

Uptrace is a distributed tracing tool that collects data using OpenTelemetry and stores it in ClickHouse database.

[[toc]]

## Database

The [database schema](https://github.com/uptrace/uptrace/blob/master/pkg/bunapp/migrations/20211204231031_initial.up.sql) contains the following tables:

- `spans_index` is the main table that is used for filtering and aggregating data. For best performance, we try to store each span attribute in a separate column and truncate long attributes.
- `spans_data` is an auxilary table that is used to select spans that were found using `spans_index` table. We also use it to select all spans for a trace. It contains the original untruncated data and is much faster when querying by `trace_id` than `spans_index` table.

To ease debugging, you can configure Uptrace to [log all executed queries](debugging.md#logging).

## Routes

By default, Uptrace accepts requests on 2 ports:

- `listen.grpc = :14317` for gRPC requests from OpenTelemetry SDK. See [OTLP](#otlp) below.
- `listen.http = :14318` for HTTP requests from OpenTelemetry SDK and Vue.js UI.

gRPC services and HTTP routes are defined in [pkg/tracing/init.go](https://github.com/uptrace/uptrace/blob/master/pkg/tracing/init.go) and that is where you can start exploring Uptrace code.

## Compiling Uptrace collector

To compile and run Uptrace locally, you need Go 1.22, PostgreSQL 15+, and ClickHouse 22.11+.

**Step 1**. Create `uptrace` ClickHouse database:

```shell
clickhouse-client -q "CREATE DATABASE uptrace"
```

**Step 2**. Create `uptrace` PostgreSQL database:

```shell
sudo -u postgres psql
postgres=# create database uptrace;
postgres=# create user uptrace with encrypted password 'uptrace';
postgres=# grant all privileges on database uptrace to uptrace;
postgres=# \c uptrace
postgres=# grant all on schema public to uptrace;
```

**Step 3**. Init Git submodules:

```shell
git submodule update --init --recursive
```

**Step 4**. Build Uptrace UI:

```shell
make uptrace-vue
```

**Step 5**. Start Uptrace:

```shell
UPTRACE_CONFIG=config/uptrace.yml go run cmd/uptrace/main.go serve
```

**Step 6**. Open Uptrace UI at `http://localhost:14318`

Uptrace will monitor itself using [OpenTelemetry Go distro](opentelemetry-go.md) for Uptrace. To get some test data, just reload the UI few times.

You can also run Uptrace in debug mode by providing an environment variable:

```shell
DEBUG=2 go run cmd/uptrace/main.go serve
```

To learn more about available commands:

```shell
go run cmd/uptrace/main.go help
```

## Running Uptrace UI

To develop UI, Uptrace uses Vue.js 2.7 and composition API. To run UI in development mode:

```shell
cd vue
pnpm install
pnpm serve
```

And open `http://localhost:19876`

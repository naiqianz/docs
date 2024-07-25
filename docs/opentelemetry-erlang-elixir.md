---
title: Monitor OpenTelemetry Erlang Elixir with Uptrace
description: Learn how to monitor your Erlang/Elixir applications with OpenTelemetry and Uptrace.
keywords:
  - opentelemetry elixir
  - opentelemetry erlang
  - uptrace elixir
  - uptrace elang
---

# Monitor Erlang/Elixir applications with Uptrace

<img src="/devicon/elixir-original.svg" width="200" />

This document explains how to configure OpenTelemetry Erlang/Elixir SDK to export spans to Uptrace using OTLP/gRPC.

[[toc]]

## Configuration

OpenTelemetry SDK starts up its supervision tree on boot, so initial configuration must be done through the Application or [environment variables](#environment-variables).

To send data to a [self-managed Uptrace](https://github.com/uptrace/uptrace) installation:

<CodeGroup>
  <CodeGroupItem title="Elixir">

```elixir
config :opentelemetry,
  span_processor: :batch,
  traces_exporter: :otlp

config :opentelemetry_exporter,
  otlp_protocol: :grpc,
  otlp_compression: :gzip,
  otlp_endpoint: "http://localhost:14317"
  otlp_headers: [{"uptrace-dsn", "http://project2_secret_token@localhost:14318?grpc=14317"}]
```

  </CodeGroupItem>

  <CodeGroupItem title="Erlang">

```erlang
[
 {opentelemetry,
  [{span_processor, batch},
   {traces_exporter, otlp}]},

 {opentelemetry_exporter,
  [{otlp_protocol, grpc},
   {otlp_compression, gzip},
   {otlp_endpoint, "http://localhost:14317"},
   {otlp_headers, [{"uptrace-dsn", "http://project2_secret_token@localhost:14318?grpc=14317"}]]}]}
].
```

  </CodeGroupItem>
</CodeGroup>

To send data to [Uptrace Cloud](https://uptrace.dev/):

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Elixir">

```elixir:no-v-pre
config :opentelemetry,
  span_processor: :batch,
  traces_exporter: :otlp

config :opentelemetry_exporter,
  otlp_protocol: :grpc,
  otlp_compression: :gzip,
  otlp_endpoint: "https://otlp.uptrace.dev:4317"
  otlp_headers: [{"uptrace-dsn", "{{ dsn }}"}]
```

  </CodeGroupItem>

  <CodeGroupItem title="Erlang">

```erlang:no-v-pre
[
 {opentelemetry,
  [{span_processor, batch},
   {traces_exporter, otlp}]},

 {opentelemetry_exporter,
  [{otlp_protocol, grpc},
   {otlp_compression, gzip},
   {otlp_endpoint, "https://otlp.uptrace.dev:4317"},
   {otlp_headers, [{"uptrace-dsn", "{{ dsn }}"}]]}]}
].
```

  </CodeGroupItem>
</CodeGroup>

See the official [documentation](https://hexdocs.pm/opentelemetry_exporter/readme.html#configuration) for the full list of available options.

## Environment variables

You can also configure OpenTelemetry using the environment variables.

To send data to a [self-managed Uptrace](https://github.com/uptrace/uptrace) installation:

```shell
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:14317
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_TRACES_COMPRESSION=gzip
OTEL_EXPORTER_OTLP_TRACES_HEADERS="uptrace-dsn=http://project2_secret_token@localhost:14318?grpc=14317"
```

To send data to [Uptrace Cloud](https://uptrace.dev/):

<ProjectPicker v-model="activeProject" :projects="projects" />

```shell:no-v-pre
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://otlp.uptrace.dev:4317
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_TRACES_COMPRESSION=gzip
OTEL_EXPORTER_OTLP_TRACES_HEADERS="uptrace-dsn={{ dsn }}"
```

See the official [documentation](https://hexdocs.pm/opentelemetry_exporter/readme.html#os-environment) for the full list of available options.

## OpenTelemetry Phoenix

To use [OpenTelemetry Phoenix](instrument/opentelemetry-phoenix.html#usage), you'll need to add the `opentelemetry_phoenix` library to your application's dependencies in the `mix.exs` file.

In your application start:

```elixir
def start(_type, _args) do
  :opentelemetry_cowboy.setup()
  OpentelemetryPhoenix.setup(adapter: :cowboy2)

  children = [
    {Phoenix.PubSub, name: MyApp.PubSub},
    MyAppWeb.Endpoint
  ]

  opts = [strategy: :one_for_one, name: MyStore.Supervisor]
  Supervisor.start_link(children, opts)
end
```

See the official [documentation](https://hexdocs.pm/opentelemetry_phoenix/OpentelemetryPhoenix.html) for the full list of supported options.

## OpenTelemetry Ecto

OpenTelemetry Ecto is a set of packages and libraries for instrumenting the Ecto library with OpenTelemetry.

OpenTelemetry Ecto provides the ability to trace Ecto database operations, such as database queries and changes, and to measure the performance and resource utilization of these operations. This information can then be analyzed to understand how an application is using the database and to identify performance bottlenecks and other issues.

To use OpenTelemetry Elixir Ecto, you'll need to add the `opentelemetry_ecto` library to your application's dependencies in the `mix.exs` file.

In your application `start`:

```elixir
OpentelemetryEcto.setup([:blog, :repo])
```

See the official [documentation](https://hexdocs.pm/opentelemetry_ecto/OpentelemetryEcto.html) for the full list of supported options.

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

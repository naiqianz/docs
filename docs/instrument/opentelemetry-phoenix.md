---
title: OpenTelemetry Phoenix monitoring
description: OpenTelemetry Phoenix is a library for instrumenting Phoenix Framework with OpenTelemetry.
keywords:
  - opentelemetry phoenix
  - otel phoenix
  - opentelemetry phoenix framework
---

<CoverImage title="Monitor Elixir Phoenix with OpenTelemetry" />

OpenTelemetry Phoenix is an implementation of the OpenTelemetry specification for Phoenix Framework. It provides a set of libraries and tools for instrumenting Phoenix applications to collect telemetry data such as metrics, traces, and logs.

Otel Phoenix provides the ability to trace Phoenix web requests and to measure the performance and resource utilization of these requests. You can then analyze this information to understand how an application is handling web traffic and to identify performance bottlenecks and other issues.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-4.md)!!!

## OpenTelemetry Phoenix

With OpenTelemetry Phoenix, developers can gain a deeper understanding of how their applications handle web requests. Then can use this information to improve the performance and reliability of their applications.

Otel Phoenix can help developers monitor and diagnose issues with their Phoenix-based applications, and it can provide valuable insights into the behavior of the applications in production.

## Usage

To use OpenTelemetry Phoenix, you'll need to add the `opentelemetry_phoenix` library to your application's dependencies in the `mix.exs` file.

In your application `start`:

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

## What is Uptrace?

!!!include(what-is-uptrace-5.md)!!!

## What's next?

To get start with OpenTelemetry, see [OpenTelemetry Elixir](../opentelemetry-erlang-elixir.html).

To collect more telemetry data from your Phoenix application, you'll need to instrument your code using the OpenTelemetry Phoenix API. This typically involves adding calls to the OpenTelemetry Phoenix library at key points in your code, such as when a request is received or when a database query is executed.

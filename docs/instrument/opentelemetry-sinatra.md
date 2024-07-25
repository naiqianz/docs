---
title: OpenTelemetry Sinatra monitoring
description: Integrate OpenTelemetry Sinatra into your app to collect observability data.
---

<CoverImage title="Monitor Sinatra performance with OpenTelemetry" />

[[toc]]

Sinatra is a lightweight web application framework for Ruby. It is designed to provide a simple and flexible way to build web applications. While Sinatra itself does not have built-in support for OpenTelemetry, you can integrate OpenTelemetry instrumentation into your Sinatra application to collect observability data.

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-4.md)!!!

## Sinatra instrumentation

To instrument Sinatra app, you need a corresponding Sinatra OpenTelemetry instrumentation:

```shell
gem install opentelemetry-instrumentation-sinatra
```

If you use bundler, add `opentelemetry-instrumentation-sinatra` to your Gemfile.

## Getting started

To get started, call `use` with the name of the instrumentation:

```ruby
require 'uptrace'
require 'opentelemetry-instrumentation-sinatra'

Uptrace.configure_opentelemetry(dsn: '') do |c|
  c.use 'OpenTelemetry::Instrumentation::Sinatra
end
```

Alternatively, you can call `use_all` to install all available instrumentations:

```ruby
require 'uptrace'
require 'opentelemetry-instrumentation-sinatra'

Uptrace.configure_opentelemetry(dsn: '') do |c|
  c.use_all
end
```

## What is Uptrace?

!!!include(what-is-uptrace-1.md)!!!

## What's next?

Next, you can instrument your Sinatra application code to create spans and record telemetry data. You can use the [OpenTelemetry Ruby Tracing API](https://uptrace.dev/opentelemetry/ruby-tracing.html) to create spans around specific operations or code blocks you want to track. For example, you can create a span around a specific route or a database query.

- [OpenTelemetry Rails](opentelemetry-rails.md)
- [OpenTelemetry Beego](opentelemetry-beego.md)

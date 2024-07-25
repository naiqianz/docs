---
title: OpenTelemetry Ruby On Rails
description: Monitor your Rails app performance using OpenTelemetry Rails instrumentation.
keywords:
  - opentelemetry rails
  - opentelemetry ruby on rails
---

# Monitor Ruby On Rails performance with OpenTelemetry

![OpenTelemetry Rails](/cover/opentelemetry-rails.png)

OpenTelemetry can be integrated with Ruby on Rails to add observability and monitoring capabilities to your Rails applications.

By integrating OpenTelemetry, you can collect telemetry data, such as distributed traces and metrics, and send it to various backends for analysis and visualization.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-6.md)!!!

## What is Ruby on Rails?

Ruby on Rails is a popular open source web application framework written in the Ruby programming language.

Rails follows the Model-View-Controller (MVC) architectural pattern and provides a set of conventions and libraries to simplify and accelerate web development.

Ruby on Rails has gained popularity due to its focus on developer happiness, productivity, and code simplicity. It has been used to build a wide range of applications, from small websites to large, high-traffic platforms.

## Rails instrumentation

OpenTelemetry provides instrumentation for various Ruby libraries and frameworks, including Rails. To install OpenTelemetry instrumentation for Ruby on Rails:

```shell
gem install opentelemetry-instrumentation-rails
```

If you use bundler, add `opentelemetry-instrumentation-rails` to your Gemfile.

## Usage

By integrating OpenTelemetry with Ruby on Rails, you can gain valuable insight into the performance, behavior, and dependencies of your application. You can monitor and troubleshoot problems, optimize performance, and ensure the reliability of your Rails applications.

To instrument your Rails app, call `use` with the name of the instrumentation:

```ruby
require 'uptrace'
require 'opentelemetry-instrumentation-rails'

Uptrace.configure_opentelemetry(dsn: '') do |c|
  c.use 'OpenTelemetry::Instrumentation::Rails'
end
```

Alternatively, you can call `use_all` to install all available instrumentations:

```ruby
require 'uptrace'
require 'opentelemetry-instrumentation-rails'

Uptrace.configure_opentelemetry(dsn: '') do |c|
  c.use_all
end
```

See [example](https://github.com/uptrace/uptrace-ruby/tree/master/example/rails) for details.

## Instrumenting ActiveRecord

Just like with Rails, you need to install ActiveRecord instrumentation:

```shell
gem install opentelemetry-instrumentation-active_record
```

And call `use` with the name of the instrumentation:

```ruby
require 'uptrace'
require 'opentelemetry-instrumentation-active_record'

Uptrace.configure_opentelemetry(dsn: '') do |c|
  c.use 'OpenTelemetry::Instrumentation::ActiveRecord'
end
```

## What is Uptrace?

!!!include(what-is-uptrace-7.md)!!!

## What's next?

OpenTelemetry allows you to instrument specific parts of your code for custom telemetry collection. You can use [OpenTelemetry Ruby APIs](https://uptrace.dev/opentelemetry/ruby-tracing.html) to manually create spans and add custom attributes, events, or metrics to capture additional information.

- [OpenTelemetry Sinatra](opentelemetry-sinatra.md)
- [OpenTelemetry Beego](opentelemetry-beego.md)

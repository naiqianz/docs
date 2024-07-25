# OpenTelemetry Ruby distro for Uptrace

<a href="https://github.com/uptrace/uptrace-ruby" target="_blank">
  <img src="/devicon/ruby-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry Ruby SDK to export spans and metrics to Uptrace using OTLP/HTTP.

To learn about OpenTelemetry API, see [OpenTelemetry Ruby Tracing API](https://uptrace.dev/opentelemetry/ruby-tracing.html) and [OpenTelemetry Ruby Metrics API](https://uptrace.dev/opentelemetry/ruby-metrics.html).

[[toc]]

## Uptrace Ruby

[uptrace-ruby](https://github.com/uptrace/uptrace-ruby) is a thin wrapper over [opentelemetry-ruby](https://github.com/open-telemetry/opentelemetry-ruby) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

Add to `Gemfile`:

```ruby
gem 'uptrace'
```

Or install the gem:

```shell
gem install uptrace
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

```ruby:no-v-pre
require 'uptrace'

# copy your project DSN here or use UPTRACE_DSN env var
Uptrace.configure_opentelemetry(dsn: '{{ dsn }}') do |c|
  # c is OpenTelemetry::SDK::Configurator
  c.service_name = 'myservice'
  c.service_version = '1.0.0'

  c.resource = OpenTelemetry::SDK::Resources::Resource.create(
    'deployment.environment' => 'production'
  )
end
```

!!!include(env-vars.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 1**. Add [uptrace](https://github.com/uptrace/uptrace-ruby) to the `Gemfile`:

```shell
gem 'uptrace'
```

- **Step 2**. Copy the [code](https://github.com/uptrace/uptrace-ruby/tree/master/example/basic) to `main.rb` replacing the `<dsn>`:

<ProjectPicker v-model="activeProject" :projects="projects" />

```ruby:no-v-pre
#!/usr/bin/env ruby
# frozen_string_literal: true

require 'rubygems'
require 'bundler/setup'
require 'uptrace'

# Configure OpenTelemetry with sensible defaults.
# Copy your project DSN here or use UPTRACE_DSN env var.
Uptrace.configure_opentelemetry(dsn: '{{ dsn }}') do |c|
  # c is OpenTelemetry::SDK::Configurator
  c.service_name = 'myservice'
  c.service_version = '1.0.0'

  c.resource = OpenTelemetry::SDK::Resources::Resource.create(
    'deployment.environment' => 'production'
  )
end

# Create a tracer. Usually, tracer is a global variable.
tracer = OpenTelemetry.tracer_provider.tracer('my_app_or_gem', '0.1.0')

# Create a root span (a trace) to measure some operation.
tracer.in_span('main-operation', kind: :client) do |main|
  tracer.in_span('GET /posts/:id') do |child1|
    child1.set_attribute('http.method', 'GET')
    child1.set_attribute('http.route', '/posts/:id')
    child1.set_attribute('http.url', 'http://localhost:8080/posts/123')
    child1.set_attribute('http.status_code', 200)
    child1.record_exception(ArgumentError.new('error1'))
  end

  tracer.in_span('SELECT') do |child2|
    child2.set_attribute('db.system', 'mysql')
    child2.set_attribute('db.statement', 'SELECT * FROM posts LIMIT 100')
  end

  puts("trace URL: #{Uptrace.trace_url(main)}")
end

# Send buffered spans and free resources.
OpenTelemetry.tracer_provider.shutdown
```

- **Step 3**. Run the code to get a link for the generated trace:

```shell
ruby main.rb
trace URL: https://uptrace.dev/traces/<trace_id>
```

- **Step 4**. Follow the link to view the generated trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-ruby/tree/master/example/otlp) is how you can configure OTLP/gRPC exporter for Uptrace following the recommendations above:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require 'rubygems'
require 'bundler/setup'
require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry-propagator-xray'

dsn = ENV.fetch('UPTRACE_DSN')
puts("using dsn: #{dsn}")

exporter = OpenTelemetry::Exporter::OTLP::Exporter.new(
  endpoint: 'https://otlp.uptrace.dev/v1/traces',
  # Set the Uptrace DSN here or use UPTRACE_DSN env var.
  headers: { 'uptrace-dsn': dsn },
  compression: 'gzip'
)
span_processor = OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(
  exporter,
  max_queue_size: 1000,
  max_export_batch_size: 1000
)

OpenTelemetry::SDK.configure do |c|
  c.service_name = 'myservice'
  c.service_version = '1.0.0'
  c.id_generator = OpenTelemetry::Propagator::XRay::IDGenerator

  c.add_span_processor(span_processor)
end

tracer = OpenTelemetry.tracer_provider.tracer('my_app_or_gem', '1.0.0')

tracer.in_span('main') do |span|
  puts("trace id: #{span.context.hex_trace_id}")
end

# Send buffered spans and free resources.
OpenTelemetry.tracer_provider.shutdown
```

## What's next?

!!!include(next-ruby.md)!!!

- [OpenTelemetry Rails](instrument/opentelemetry-rails.md)
- [OpenTelemetry Sinatra](instrument/opentelemetry-sinatra.md)

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

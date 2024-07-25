# OpenTelemetry .NET distro for Uptrace

<a href="https://github.com/uptrace/uptrace-dotnet" target="_blank">
  <img src="/devicon/dot-net-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry .NET SDK to export spans and metrics to Uptrace using OTLP/gRPC.

To learn about OpenTelemetry API, see [OpenTelemetry .NET Tracing API](https://uptrace.dev/opentelemetry/dotnet-tracing.html) and [OpenTelemetry .NET Metrics API](https://uptrace.dev/opentelemetry/dotnet-metrics.html).

[[toc]]

## Uptrace .NET

[uptrace-dotnet](https://github.com/uptrace/uptrace-dotnet) is a thin wrapper over [opentelemetry-dotnet](https://github.com/open-telemetry/opentelemetry-dotnet) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

To install uptrace-dotnet:

```shell
dotnet add package Uptrace.OpenTelemetry --prerelease
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

```cs:no-v-pre
using System;
using System.Diagnostics;

using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;

using Uptrace.OpenTelemetry;

var serviceName = "myservice";
var serviceVersion = "1.0.0";

var openTelemetry = Sdk.CreateTracerProviderBuilder()
    .AddSource("*") // subscribe to all activity sources
    .SetResourceBuilder(
        ResourceBuilder
            .CreateDefault()
            .AddEnvironmentVariableDetector()
            .AddTelemetrySdk()
            .AddService(serviceName: serviceName, serviceVersion: serviceVersion)
    )
    // copy your project DSN here or use UPTRACE_DSN env var
    //.AddUptrace("{{ dsn }}")
    .AddUptrace()
    .Build();
```

!!!include(env-vars.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 1**. Clone the [basic](https://github.com/uptrace/uptrace-dotnet/tree/master/example/basic) example:

```shell
git clone https://github.com/uptrace/uptrace-dotnet/tree/master/example/basic
cd example/basic
```

- **Step 2**. Run the example to get a link for the generated trace:

<ProjectPicker v-model="activeProject" :projects="projects" />

```shell:no-v-pre
$ UPTRACE_DSN="{{ dsn }}" dotnet run
https://uptrace.dev/traces/<trace_id>
```

- **Step 3**. Follow the link to view the trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

## Troubleshooting

If you encounter any issue with OpenTelemetry .NET, try the following guides:

- [OpenTelemetry .NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md#troubleshooting)
- [OpenTelemetry .NET instrumentation](https://github.com/open-telemetry/opentelemetry-dotnet-instrumentation/blob/main/docs/troubleshooting.md)

## What's next?

!!!include(next-dotnet.md)!!!

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

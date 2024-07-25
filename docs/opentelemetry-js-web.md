# OpenTelemetry JavaScript Web distro for Uptrace

<a href="https://github.com/uptrace/uptrace-js" target="_blank">
  <img src="/devicon/javascript-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry JavaScript SDK for Web to export spans and metrics from browsers to Uptrace using OTLP/HTTP.

If you need to monitor JavaScript Web applications, using [Sentry SDK](/ingest/sentry.md) instead of OpenTelemetry JS might provide a better result.

To learn about OpenTelemetry API, see [OpenTelemetry JS Tracing API](https://uptrace.dev/opentelemetry/js-tracing.html) and [OpenTelemetry JS Metrics API](https://uptrace.dev/opentelemetry/js-metrics.html).

[[toc]]

## Uptrace Web

[uptrace-js](https://github.com/uptrace/uptrace-js) is a thin wrapper over [opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

To install `@uptrace/web`:

```shell
# npm
npm install @uptrace/web --save-dev

# yarn
yarn add @uptrace/web --dev
```

### Configuration

You can configure Uptrace client using a DSN (Data Source Name, for example, `https://token@api.uptrace.dev/project_id`) from the project settings page.

<!-- prettier-ignore -->
::: warning
You must call `configureOpentelemetry` as early as possible and before importing other packages, because OpenTelemetry SDK must patch libraries before you import them.
:::

```js:no-v-pre
import { configureOpentelemetry } from '@uptrace/web'

// configureOpentelemetry automatically setups window.onerror handler.
configureOpentelemetry({
  // Set dsn or UPTRACE_DSN env var.
  dsn: '{{ dsn }}',

  serviceName: 'myservice',
  serviceVersion: '1.0.0',
})
```

!!!include(js-config.md)!!!

## Context manager

`ZoneContextManager` is a context manager implementation based on the Zone.js library. It enables context propagation within the application using zones.

To install Zone.js context manager:

```js
npm install --save @opentelemetry/context-zone
```

To use Zone.js context manager:

```js
import { ZoneContextManager } from '@opentelemetry/context-zone'

configureOpentelemetry({
  contextManager: new ZoneContextManager(),
})
```

## Instrumentations

You can use `configureOpentelemetry` to register instrumentations like this:

```js
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'

configureOpentelemetry({
  instrumentations: [new FetchInstrumentation()],
})
```

Or use `registerInstrumentations` directly:

```js
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { registerInstrumentations } from '@opentelemetry/instrumentation'

registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
})
```

See opentelemetry-js [web plugins](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web) for the full list of available instrumentations.

### Instrumenting Vue.js 2.x

```js
import Vue from 'vue'
import { configureOpentelemetry, reportException } from '@uptrace/web'

configureOpentelemetry({
  dsn: 'https://token@api.uptrace.dev/project_id',
})

Vue.config.errorHandler = (err, vm, info) => {
  reportException(err, {
    vm: vm,
    info: info,
  })
}
```

## Troubleshooting

!!!include(js-troubleshooting.md)!!!

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

---
title: Using Sentry SDK client with Uptrace
---

# Using Sentry SDK client with Uptrace

![Ingest Sentry](/cover/ingest-sentry.png)

<!-- prettier-ignore -->
::: tip
Sentry integration is a new feature that will be improved based on the demand and feedback from users. So if you are interested in this feature or encounter any issues, please let us know on [GitHub](https://github.com/uptrace/uptrace/).
:::

Sentry is an open-source error tracking and monitoring tool that helps developers track, prioritize, and fix issues in real-time. It is used to monitor and report errors and exceptions in web and mobile applications.

Sentry SDK has been actively developed and maintained for 10+ years and has a large and active community of users and contributors.

If you need to monitor JavaScript Web applications, using Sentry SDK instead of [OpenTelemetry JS](/opentelemetry-js-web.md) might provide a better result.

[[toc]]

## Sentry for browsers

Sentry SDK for browsers supports a wide range of web technologies and frameworks, including React, Angular, Vue.js, and more. It also provides detailed error reports and data, including stack traces, error messages, and user data, helping developers identify and fix errors quickly.

To install Sentry SDK for browsers:

```shell
# npm
npm install --save @sentry/browser

# yarn
yarn add @sentry/browser
```

Then you need to initialize the SDK using Uptrace OTLP/HTTP [DSN](../get-started.md#dsn):

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```js:no-v-pre
import { init, captureMessage } from '@sentry/browser'

init({
  dsn: '{{ dsn }}',
  // ...
})

captureMessage('Hello, world!')
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```js
import { init, captureMessage } from '@sentry/browser'

init({
  dsn: 'http://project2_secret_token@localhost:14318?grpc=14317',
  // ...
})

captureMessage('Hello, world!')
```

  </CodeGroupItem>
</CodeGroup>

Sentry also provides packages for [React](https://github.com/getsentry/sentry-javascript/tree/master/packages/react), [Vue.js](https://github.com/getsentry/sentry-javascript/tree/master/packages/vue), [Angular](https://github.com/getsentry/sentry-javascript/tree/master/packages/angular), and many more. For details, see [sentry-javascript](https://github.com/getsentry/sentry-javascript) documentation.

## Sentry Go

Sentry provides an SDK for the Go programming language, allowing developers to monitor and track errors and exceptions in Go applications.

Install sentry-go:

```shell
go get github.com/getsentry/sentry-go
```

Then use Uptrace OTLP/HTTP [DSN](../get-started.md#dsn) to initialize Sentry SDK:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```go:no-v-pre
import "github.com/getsentry/sentry-go"

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              "{{ dsn }}",
		EnableTracing:    true,
		TracesSampleRate: 1.0,
	})
	if err != nil {
		panic(err)
	}
	defer sentry.Flush(3 * time.Second)
}
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```go
import "github.com/getsentry/sentry-go"

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              "http://project2_secret_token@localhost:14318?grpc=14317",
		EnableTracing:    true,
		TracesSampleRate: 1.0,
	})
	if err != nil {
		panic(err)
	}
	defer sentry.Flush(3 * time.Second)
}
```

  </CodeGroupItem>
</CodeGroup>

For more details, see [sentry-go](https://github.com/getsentry/sentry-go) documentation.

- [Sentry vs Datadog](https://uptrace.dev/blog/sentry-vs-datadog.html)

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

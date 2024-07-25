# 开始使用 Uptrace

Getting started with Uptrace and OpenTelemetry is easy:

1. To host Uptrace yourself, [download and install](install.md) Uptrace binary. Or [create](https://app.uptrace.dev/join) a free cloud account and let us manage Uptrace for you.

2. To start receiving data, use the [DSN](#dsn) (connection string) you've obtained on the previous step to configure OpenTelemetry for your programming language.

!!!include(devicons-uptrace-distro.md)!!!

3. [Instrument](instrument/README.md) your application with plugins for popular frameworks and libraries.

Have questions? Get help via [Telegram](https://t.me/uptrace), [Slack](https://join.slack.com/t/uptracedev/shared_invite/zt-1xr19nhom-cEE3QKSVt172JdQLXgXGvw), or [start a discussion](https://github.com/uptrace/uptrace/discussions) on GitHub.

---

[[toc]]

## Infrastructure monitoring

To monitor host (infrastructure) metrics, Redis, PostgreSQL, MySQL and many more, use [OpenTelemetry Collector](ingest/collector.html).

If you are using AWS, you can also send [CloudWatch Metrics](ingest/aws-cloudwatch.md#cloudwatch-metrics) directly to Uptrace.

## Logs monitoring

To monitor logs, you can use [Vector](ingest/vector.md) and [FluentBit](ingest/fluent-bit.md) integrations.

If you are using AWS, you can also send [CloudWatch Logs](ingest/aws-cloudwatch.md#cloudwatch-logs) directly to Uptrace.

## DSN

Uptrace DSN (Data Source Name) is a connection string that is used to connect and send data to an Uptrace backend. It contains a backend address (host:port) and a secret token that grants access to a project.

For example, the DSN `http://project1_secret_token@localhost:14318?grpc=14317` contains the following information:

- `http` tells the client to disable TLS. Use `https` to enable TLS.
- `localhost:14317` is an address of the Uptrace backend. The cloud version always uses the `api.uptrace.dev` address without a port.
- `project1_secret_token` is a secret token that is used for authentication.
- `?grpc=14318` is a GRPC port.

You can find your project DSN on the Project Settings page:

![Uptrace DSN](/uptrace/dsn.png)

## Resource attributes

Resource attributes are key-value pairs that provide metadata about the monitored entity, such as a service, process, or container. They help identify the resource and provide additional information that can be used to filter and group telemetry data.

For the full list of attributes, see [Semantic attributes](https://uptrace.dev/opentelemetry/attributes.html), but here are the most popular resource attributes to get you started.

| Attribute                   | Comment                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [service.name][1]           | Logical name of the service. Uptrace provides an overview of all services.                                                |
| [service.version][2]        | The version string of the service API or implementation.                                                                  |
| [deployment.environment][3] | Name of the deployment environment (aka deployment tier). Uptrace can group spans from different environments separately. |
| [host.name][4]              | Name of the host. Usually, resource detectors discover and set this attribute automatically.                              |

[1]: https://uptrace.dev/opentelemetry/attributes.html?attribute=service.name
[2]: https://uptrace.dev/opentelemetry/attributes.html?attribute=service.version
[3]: https://uptrace.dev/opentelemetry/attributes.html?attribute=deployment.environment
[4]: https://uptrace.dev/opentelemetry/attributes.html?attribute=host.name

You can set those attributes by using the `env` resource detector and providing the `OTEL_RESOURCE_ATTRIBUTES` environment variable:

```shell
export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0,deployment.environment=production
```

Or you can configure them during OpenTelemetry initialization:

<CodeGroup>
  <CodeGroupItem title="Go">

```go
// https://uptrace.dev/get/opentelemetry-go.html

import (
	"github.com/uptrace/uptrace-go/uptrace"
	"go.opentelemetry.io/otel/attribute"
)

uptrace.ConfigureOpentelemetry(
	// copy your project DSN here or use UPTRACE_DSN env var
	//uptrace.WithDSN(""),

	uptrace.WithServiceName("myservice"),
	uptrace.WithServiceVersion("v1.0.0"),
	uptrace.WithResourceAttributes(
		attribute.String("deployment.environment", "production"),
	),
)
```

  </CodeGroupItem>

  <CodeGroupItem title="Python">

```python
# https://uptrace.dev/get/opentelemetry-python.html

import uptrace

# copy your project DSN here or use UPTRACE_DSN env var
uptrace.configure_opentelemetry(
  dsn="",
  service_name="myservice",
  service_version="1.0.0",
  resource_attributes={"deployment.environment": "production"},
)
```

  </CodeGroupItem>

  <CodeGroupItem title="Ruby">

```ruby
# https://uptrace.dev/get/opentelemetry-ruby.html

require 'uptrace'

# copy your project DSN here or use UPTRACE_DSN env var
Uptrace.configure_opentelemetry(dsn: '') do |c|
  # c is OpenTelemetry::SDK::Configurator
  c.service_name = 'myservice'
  c.service_version = '1.0.0'

  c.resource = OpenTelemetry::SDK::Resources::Resource.create(
    'deployment.environment' => 'production'
  )
end
```

  </CodeGroupItem>

  <CodeGroupItem title="JavaScript">

```js
// https://uptrace.dev/get/opentelemetry-js-node.html

const uptrace = require('@uptrace/node')

uptrace
  .configureOpentelemetry({
    // copy your project DSN here or use UPTRACE_DSN env var
    //dsn: '',
    serviceName: 'myservice',
    serviceVersion: '1.0.0',
    resourceAttributes: { 'deployment.environment': 'production' },
  })
  // Start OpenTelemetry SDK.
  .start()
  // Then execute the main function when SDK is ready.
  .then(main)
```

  </CodeGroupItem>

  <CodeGroupItem title="PHP">

```php
// https://uptrace.dev/get/opentelemetry-php.html

$uptrace = Uptrace\Distro::builder()
    // copy your project DSN here or use UPTRACE_DSN env var
    //->setDsn('https://token@api.uptrace.dev/project_id')
    ->setServiceName('myservice')
    ->setServiceVersion('1.0.0')
    ->setResourceAttributes(['deployment.environment' => 'production'])
    ->buildAndRegisterGlobal();
```

  </CodeGroupItem>
</CodeGroup>

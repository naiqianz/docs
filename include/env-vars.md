You can also use environment variables to configure the client:

| Env var                       | Description                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `UPTRACE_DSN`                 | A data source that is used to connect to uptrace.dev. For example, `https://<token>@uptrace.dev/<project_id>`.  |
| `OTEL_RESOURCE_ATTRIBUTES`    | Key-value pairs to be used as resource attributes. For example, `service.name=myservice,service.version=1.0.0`. |
| `OTEL_SERVICE_NAME=myservice` | Sets the value of the service.name resource attribute. Takes precedence over `OTEL_RESOURCE_ATTRIBUTES`.        |
| `OTEL_PROPAGATORS`            | Propagators to be used as a comma separated list. The default is `tracecontext,baggage`.                        |

See OpenTelemetry [documentation](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/) for details.

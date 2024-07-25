You can use the following options to configure Uptrace client.

| Option                  | Description                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dsn`                   | A data source that is used to connect to uptrace.dev. For example, `https://<token>@uptrace.dev/<project_id>`.                       |
| `serviceName`           | `service.name` resource attribute. For example, `myservice`.                                                                         |
| `serviceVersion`        | `service.version` resource attribute. For example, `1.0.0`.                                                                          |
| `deploymentEnvironment` | `deployment.environment` resource attribute. For example, `production`.                                                              |
| `resourceAttributes`    | Any other resource attributes.                                                                                                       |
| `resource`              | Resource contains attributes representing an entity that produces telemetry. Resource attributes are copied to all spans and events. |

!!!include(env-vars.md)!!!

# Chart annotations

Chart annotations are labels or notes added to a chart to provide additional information or context. Annotations help clarify the data presented in the chart and help the viewer understand key points or trends.

Uptrace displays annotations as square dots on the x-axis. Clicking on an annotation displays the annotation description and tags. The description field can contain markdown links to other systems with more details.

![Chart annotations](/cover/annotations.png)

## Creating annotations

You can create annotations by sending an HTTP `POST` request to the Uptrace API:

```shell
curl -X POST https://api.uptrace.dev/api/v1/annotations \
   -H 'uptrace-dsn: https://<token>@api.uptrace.dev/<project_id>' \
   -d '{"name":"Deployed to production", "attrs": {"service.version": "540d2ee"}}'
```

The JSON payload must include the `name` field. Other fields are optional.

| Field         | Description                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`        | Annotation name. Required.                                                                                       |
| `description` | Annotation description text in Markdown format. Optional.                                                        |
| `color`       | Color to be used in charts, for example, `green` or `#00ff00`. Optional.                                         |
| `attrs`       | Key-value metadata, for example, `{"deployment.environment": "production"}`. Optional.                           |
| `fingerprint` | Unique string used for deduplication. Uptrace will ignore other annotations with the same fingerprint. Optional. |
| `time`        | Overrides annotation time in RFC3339 format. Optional.                                                           |

For example:

```shell
curl -X POST https://api.uptrace.dev/api/v1/annotations \
   -H 'uptrace-dsn: https://<token>@api.uptrace.dev/<project_id>' \
   -d '{"name":"Deployed to production", "fingerprint": "v1.2.3", "attrs": {"service.version": "v1.2.3"}}'
```

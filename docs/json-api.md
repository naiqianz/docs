# Uptrace JSON API

Uptrace Cloud provides the following API free of charge as long as you use it occasionally to read a small fraction of the ingested data, for example, a few requests per hour to read data for the last few hours is fine.

If you need more than that, please contact [support](mailto:support@uptrace.dev) to discuss your use case.

[[toc]]

## API stability

The API is stable and will not change without a very good reason, such as reworking existing features or removing problematic functionality. Whenever possible, changes are made in a backward-compatible manner.

If you would like to be notified when the API changes, please send an email to [support@uprace.dev](mailto:support@uprace.dev) explaining your use case.

## Authentication

To use the API below, you will need a project id (`<project_id>`) and an authentication token (`<token>`).

You can create an authentication token on your user profile page. The token will have the same permissions as the user, .i.e. you should be able to access the same projects.

## Spans API

### List spans

You can retrieve a list of spans like this:

```shell:no-v-pre
curl https://api.uptrace.dev/api/v1/tracing/<project_id>/spans?time_gte=2023-07-10T00:00:00Z&time_lt=2023-07-11T00:00:00Z \
  --header "Authorization: Bearer <token>"
```

Supported query params:

| Param                                        |          | Comment                                   |
| -------------------------------------------- | -------- | ----------------------------------------- |
| `?time_gte=2023-07-10T00:00:00Z`             | Required | Time greater than or equal to `time_gte`. |
| `?time_lt=2023-07-11T00:00:00Z`              | Required | Time lower than `time_lt`.                |
| `?trace_id=17706d68ea23cf9bc8976ca57d22ee31` | Optional | Filter spans by trace id.                 |
| `?id=12345`                                  | Optional | Filter spans by span id.                  |
| `?parent_id=12345`                           | Optional | Filter spans by parent span id.           |
| `?limit=10000`                               | Optional | Limit number of spans.                    |

### Query groups

You can aggregate spans using [UQL](querying-spans.md) like this:

```shell:no-v-pre
curl https://api.uptrace.dev/api/v1/tracing/<project_id>/groups?time_gte=2023-07-10T00:00:00Z&time_lt=2023-07-11T00:00:00Z&query=group%20by%20host_name \
  --header "Authorization: Bearer <token>"
```

Supported query params:

| Param                            |          | Comment                                               |
| -------------------------------- | -------- | ----------------------------------------------------- |
| `?time_gte=2023-07-10T00:00:00Z` | Required | Time greater than or equal to `time_gte`.             |
| `?time_lt=2023-07-11T00:00:00Z`  | Required | Time lower than `time_lt`.                            |
| `?query=group by host_name`      | Optional | Aggregate spans with the query.                       |
| `?limit=10000`                   | Optional | Limit number of spans.                                |
| `?search=option1\|option2`       | Optional | Search for spans that contain `option1` or `option2`. |
| `?duration_gte=10000`            | Optional | Duration greater than or equal to N. Microseconds.    |
| `?duration_lt=100000`            | Optional | Duration greater than or equal to N. Microseconds.    |

## Alerting API

### Metric monitors

#### Create

##### Request

To create a metric monitor:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors \
  --request POST \
  --header "Authorization: Bearer <token>" \
  --header "Content-Type: application/json" \
  --data @monitor.json
```

Put the following contents in the `monitor.json`:

```json
{
  "name": "Number of spans per minute",
  "type": "metric",
  "notifyEveryoneByEmail": true,
  "teamIds": [123],
  "channelIds": [123],
  "params": {
    "metrics": [{ "name": "uptrace_tracing_spans", "alias": "spans" }],
    "query": "per_min(count($spans)) as spans | where service_name = 'myservice'",
    "column": "spans",
    "minAllowedValue": 100,
    "maxAllowedValue": 1000,
    "nullsMode": "convert"
  }
}
```

Supported JSON fields:

| JSON field              |                           | Comment                                                                      |
| ----------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `name`                  | Required. String.         | Monitor name.                                                                |
| `type`                  | Required. String.         | Must be set to `metric`.                                                     |
| `notifyEveryoneByEmail` | Optional. Bool.           | Whether to notify everyone by email.                                         |
| `teamIds`               | Optional. Arrays of ints. | List of team ids to be notified by email. Overrides `notifyEveryoneByEmail`. |
| `channelIds`            | Optional. Array of ints.  | List of channel ids to send notifications.                                   |
| `params`                | Required. Object.         | Metric monitor params. See below.                                            |

Manual metric monitors support the following params:

| Param              |                    | Example                                                                    |
| ------------------ | ------------------ | -------------------------------------------------------------------------- |
| `metrics`          | Required. Array.   | `[{"name": "uptrace_tracing_spans", "alias": "spans"}]`                    |
| `query`            | Required. String.  | `per_min(sum($spans)) as spans`                                            |
| `column`           | Required. String.  | Column name to monitor, e.g.`spans`.                                       |
| `minAllowedValue`  | Required\*. Float. | Inclusive. Values lower than this are reported.                            |
| `maxAllowedValue`  | Required. Float.   | Inclusive. Values greater than this are reported.                          |
| `groupingInterval` | Optional. Float.   | Grouping interval in milliseconds. The default `60000` (1 minute).         |
| `checkNumPoint`    | Optional. Int.     | Number of points to check. The default is `5`.                             |
| `nullsMode`        | Optional. Enum.    | Nulls handling mode: `allow`, `forbid`, `convert`. The default is `allow`. |
| `timeOffset`       | Optional. Float.   | Time offset in milliseconds, e.g. `60000` delays check by 1 minute.        |

\* At least `minAllowedValue` or `maxAllowedValue` is required.

##### Response

The response looks like this:

```json
{
  "monitor": {
    "id": "3807"
  }
}
```

You can use the monitor id to update/delete the monitor later.

#### Update

To update the metric monitor by id:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors/<monitor_id> \
  --request PUT \
  --header "Authorization: Bearer <token>" \
  --header "Content-Type: application/json" \
  --data @monitor.json
```

The `monitor.json` file should contain the same JSON fields that you used to create the monitor.

##### Response

The response looks like this:

```json
{
  "monitor": {
    "id": "3807"
  }
}
```

#### Delete

To delete the metric monitor by id:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors/<monitor_id> \
  --request DELETE \
  --header "Authorization: Bearer <token>"
```

### Error monitors

#### Create

##### Request

To create an error monitor:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors \
  --request POST \
  --header "Authorization: Bearer <token>" \
  --header "Content-Type: application/json" \
  --data @monitor.json
```

Put the following contents in the `monitor.json`:

```json
{
  "name": "Number of spans per minute",
  "type": "error",
  "notifyEveryoneByEmail": true,
  "teamIds": [123],
  "channelIds": [123],
  "params": {
    "metrics": [{ "name": "uptrace_tracing_logs", "alias": "logs" }],
    "query": "group by _group_id | where _system in ('log:error', 'log:fatal')"
  }
}
```

Supported JSON fields:

| JSON field              |                           | Comment                                                                      |
| ----------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `name`                  | Required. String.         | Monitor name.                                                                |
| `type`                  | Required. String.         | Must be set to `error`.                                                      |
| `notifyEveryoneByEmail` | Optional. Bool.           | Whether to notify everyone by email.                                         |
| `teamIds`               | Optional. Arrays of ints. | List of team ids to be notified by email. Overrides `notifyEveryoneByEmail`. |
| `channelIds`            | Optional. Array of ints.  | List of channel ids to send notifications.                                   |
| `params`                | Required. Object.         | Metric monitor params. See below.                                            |

Error monitors support the following params:

| Param     |                   | Example                                               |
| --------- | ----------------- | ----------------------------------------------------- |
| `metrics` | Required. Array.  | `[{"name": "uptrace_tracing_logs", "alias": "logs"}]` |
| `query`   | Required. String. | `where _system in ('log:error', 'log:fatal')`         |

##### Response

The response looks like this:

```json
{
  "monitor": {
    "id": "3807"
  }
}
```

You can use the monitor id to update/delete the monitor later.

#### Update

To update the metric monitor by id:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors/<monitor_id> \
  --request PUT \
  --header "Authorization: Bearer <token>" \
  --header "Content-Type: application/json" \
  --data @monitor.json
```

The `monitor.json` file should contain the same JSON fields that you used to create the monitor.

##### Response

The response looks like this:

```json
{
  "monitor": {
    "id": "3807"
  }
}
```

#### Delete

To delete the metric monitor by id:

```shell
curl https://api2.uptrace.dev/internal/v1/projects/<project_id>/monitors/<monitor_id> \
  --request DELETE \
  --header "Authorization: Bearer <token>"
```

## Annotations API

See [Annotations](annotations.md#creating-annotations).

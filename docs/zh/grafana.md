---
title: Using Uptrace and Grafana together
---

<CoverImage title="Using Uptrace and Grafana together" />

By adding Uptrace as a data source in Grafana, you can view traces and metrics stored by Uptrace in your favorite Grafana UI.

[[toc]]

## Prometheus Metrics

### Ingesting Prometheus metrics

To ingest Prometheus metrics into Uptrace, you can use [Prometheus remote write](http://localhost:8081/get/ingest/prometheus.html#prometheus-remote-write) or [OTLP](http://localhost:8081/get/ingest/prometheus.html#opentelemetry-collector).

If you're planning to use an existing Grafana dashboard, use the Prometheus remote write method because, unlike OTLP, it leaves metric and label names untouched. OTLP also works, but you will need to modify existing dashboards to use new attribute names.

### Grafana data source

With Grafana's Prometheus data source, you can use PromQL to query metrics stored by Uptrace. Uptrace uses the original Prometheus engine so all Prometheus queries should be supported and you should be able to use existing Grafana dashboards with the Uptrace data source.

1. In Uptrace, go to the project settings page and enable "Prometheus compatibility" mode.

2. In Grafana, go to "Data sources".
3. Click on "Add new data source" and then select "Prometheus".
4. As the Prometheus server URL, use your Uptrace HTTP address, for example, `http://localhost:14318/api/prometheus/<project_id>` or `https://api.uptrace.dev/api/prometheus/<project_id>`.
5. In "HTTP Headers" section, click "Add header" to specify [authentication token](json-api.md#authentication).

   - Header: `Authorization`
   - Value: `Bearer <your_token>`

You can also directly add Uptrace data source to `datasource.yml`:

```yaml
apiVersion: 1

datasources:
  - name: My Uptrace project
    type: prometheus
    access: proxy
    url: https://api.uptrace.dev/api/prometheus/<project_id>
    editable: true
    jsonData:
      httpHeaderName1: 'Authorization'
    secureJsonData:
      httpHeaderValue1: 'Bearer <your_token>'
```

## Tempo Traces

### Grafana data source

Using Grafana's Tempo data source, you can view and filter spans stored by Uptrace in Grafana UI.

1. In Grafana, go to "Data sources".
2. Click on the "Add new data source" button and select "Tempo".
3. As the URL, use your Uptrace HTTP address, for example, `http://localhost:14318/api/tempo/<project_id>` or `https://api.uptrace.dev/api/tempo/<project_id>`.
4. In "Custom HTTP Headers" section, click "Add header" to specify [authentication token](json-api.md#authentication).

   - Header: `Authorization`
   - Value: `Bearer <your_token>`

You can also directly add Uptrace data source to `datasource.yml`:

```yaml
apiVersion: 1

datasources:
  - name: My Uptrace project
    type: tempo
    access: proxy
    url: https://api.uptrace.dev/api/tempo/<project_id>
    editable: true
    jsonData:
      httpHeaderName1: 'Authorization'
    secureJsonData:
      httpHeaderValue1: 'Bearer <your_token>'
```

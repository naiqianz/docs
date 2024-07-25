---
title: OpenTelemetry Kubernetes Monitoring
description: Monitor your Kubernetes cluster and pods using OpenTelemetry Collector receiver.
keywords:
  - opentelemetry kubernetes
  - opentelemetry kubernetes metrics
  - opentelemetry k8s cluster
  - otel kubernetes cluster
---

# OpenTelemetry Kubernetes Monitoring

![OpenTelemetry Kubernetes](/opentelemetry-kubernetes/cover.png)

Kubernetes has become the de facto standard for container orchestration and is widely adopted by organizations of all sizes.

By using OpenTelemetry in conjunction with Kubernetes, you can gain deep insights into the performance and behavior of your applications, monitor their health and resource usage, and troubleshoot issues more effectively.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-1.md)!!!

## Authentication

Otel Collector works by using the Kubernetes API to query and monitor the state of various Kubernetes resources.

To use the Kubernetes API, you need to configure an authentication method, for example, using a service account. This means that the Otel Collector must be running on the same K8s cluster, and the service account must have sufficient permissions to use the API.

## Monitoring Kubernetes Cluster

OpenTelemetry Kubernetes Cluster [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/k8sclusterreceiver) allows you to collect observability data from your Kubernetes cluster. It captures telemetry data about the cluster's nodes, pods, containers, and other resources, providing insights into the cluster's health, performance, and resource utilization.

To start monitoring your Kubernetes cluster, you need to configure the receiver in `/etc/otel-contrib-collector/config.yaml` using your [Uptrace DSN](../get-started.md#dsn):

```yaml
receivers:
  k8s_cluster:
    auth_type: serviceAccount

exporters:
  otlp:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '<FIXME>' }

processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp, k8s_cluster]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp]
```

Don't forget to [create a service account](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/k8sclusterreceiver#service-account) with sufficient permissions.

See [Helm example](https://github.com/uptrace/helm-charts) and [Otelcol documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/k8sclusterreceiver) for more details.

## Monitoring Kubernetes Pods

OpenTelemetry Collector also provides OpenTelemetry Kubelet Stats [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/kubeletstatsreceiver) for collecting metrics from Kubelet, which is the primary node agent that runs on each node in a Kubernetes cluster.

Although it's possible to use kubernetes' hostNetwork feature to talk to the Kubelet api from a pod, the preferred approach is to use the downward API and a service account.

Make sure the pod spec sets the node name as follows:

```yaml
env:
  - name: K8S_NODE_NAME
    valueFrom:
      fieldRef:
        fieldPath: spec.nodeName
```

Then the otel config can reference the `K8S_NODE_NAME` environment variable:

```yaml
receivers:
  kubeletstats:
    auth_type: 'serviceAccount'
    endpoint: 'https://${env:K8S_NODE_NAME}:10250'
    insecure_skip_verify: true

exporters:
  otlp:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '<FIXME>' }

processors:
  resourcedetection:
    detectors: [env, system]
  cumulativetodelta:
  batch:
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp, kubeletstats]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp]
```

Don't forget to [create a service account](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/kubeletstatsreceiver#role-based-access-control) with sufficient permissions.

See [Helm example](https://github.com/uptrace/helm-charts) and [Otelcol documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/kubeletstatsreceiver) for more details.

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-3.md)!!!

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry MySQL](opentelemetry-mysql.md)
- [OpenTelemetry PHP-FPM](opentelemetry-php-fpm.md)

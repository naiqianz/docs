---
title: OpenTelemetry Docker Monitoring
description: Monitor your Docker containers using OpenTelemetry Collector receiver.
keywords:
  - opentelemetry docker
  - opentelemetry docker monitoring
  - otel docker
  - docker stats receiver
---

# OpenTelemetry Docker Monitoring

![OpenTelemetry Docker](/opentelemetry-docker/cover.png)

Docker has gained popularity due to its ability to simplify application deployment, improve scalability, and increase development productivity. It has become a standard tool in many software development and deployment workflows.

By using the OpenTelemetry Docker Stats receiver, you can gather container-level metrics from Docker and integrate them into your observability infrastructure for monitoring and analysis purposes.

[[toc]]

## What is OpenTelemetry Collector?

!!!include(collector-metrics-3.md)!!!

## OpenTelemetry Docker Stats

OpenTelemetry Docker Stats [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/dockerstatsreceiver) allows you to collect container-level resource metrics from Docker. It retrieves metrics such as CPU usage, memory usage, network statistics, and disk I/O from Docker containers and exposes them as OpenTelemetry metrics.

::: details CPU metrics

| Metric                                          | Description                                                     |
| ----------------------------------------------- | --------------------------------------------------------------- |
| container.cpu.usage.system                      | System CPU usage, as reported by docker.                        |
| container.cpu.usage.total                       | Total CPU time consumed.                                        |
| container.cpu.usage.kernelmode                  | Time spent by tasks of the cgroup in kernel mode (Linux).       |
| container.cpu.usage.usermode                    | Time spent by tasks of the cgroup in user mode (Linux).         |
| container.cpu.usage.percpu                      | Per-core CPU usage by the container.                            |
| container.cpu.throttling_data.periods           | Number of periods with throttling active.                       |
| container.cpu.throttling_data.throttled_periods | Number of periods when the container hits its throttling limit. |
| container.cpu.throttling_data.throttled_time    | Aggregate time the container was throttled.                     |
| container.cpu.percent                           | Percent of CPU used by the container.                           |

:::

::: details Memory metrics

| Metric                       | Description                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| container.memory.usage.limit | Memory limit of the container.                                                                                                    |
| container.memory.usage.total | Memory usage of the container. This excludes the cache.                                                                           |
| container.memory.usage.max   | Maximum memory usage.                                                                                                             |
| container.memory.percent     | Percentage of memory used.                                                                                                        |
| container.memory.cache       | The amount of memory used by the processes of this control group that can be associated precisely with a block on a block device. |
| container.memory.rss         | The amount of memory that doesn’t correspond to anything on disk: stacks, heaps, and anonymous memory maps.                       |
| container.memory.rss_huge    | Number of bytes of anonymous transparent hugepages in this cgroup.                                                                |
| container.memory.dirty       | Bytes that are waiting to get written back to the disk, from this cgroup.                                                         |
| container.memory.writeback   | Number of bytes of file/anon cache that are queued for syncing to disk in this cgroup.                                            |
| container.memory.mapped_file | Indicates the amount of memory mapped by the processes in the control group.                                                      |
| container.memory.swap        | The amount of swap currently used by the processes in this cgroup.                                                                |

:::

::: details BlockIO metrics

| Metric                                       | Description                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| container.blockio.io_merged_recursive        | Number of bios/requests merged into requests belonging to this cgroup and its descendant cgroups.                                           |
| container.blockio.io_queued_recursive        | Number of requests queued up for this cgroup and its descendant cgroups.                                                                    |
| container.blockio.io_service_bytes_recursive | Number of bytes transferred to/from the disk by the group and descendant groups.                                                            |
| container.blockio.io_service_time_recursive  | Total amount of time in nanoseconds between request dispatch and request completion for the IOs done by this cgroup and descendant cgroups. |
| container.blockio.io_serviced_recursive      | Number of IOs (bio) issued to the disk by the group and descendant groups.                                                                  |
| container.blockio.io_time_recursive          | Disk time allocated to cgroup (and descendant cgroups) per device in milliseconds.                                                          |
| container.blockio.io_wait_time_recursive     | Total amount of time the IOs for this cgroup (and descendant cgroups) spent waiting in the scheduler queues for service.                    |
| container.blockio.sectors_recursive          | Number of sectors transferred to/from disk by the group and descendant groups.                                                              |

:::

::: details Network metrics

| Metric                                | Description                      |
| ------------------------------------- | -------------------------------- |
| container.network.io.usage.rx_bytes   | Bytes received by the container. |
| container.network.io.usage.tx_bytes   | Bytes sent.                      |
| container.network.io.usage.rx_dropped | Incoming packets dropped.        |
| container.network.io.usage.tx_dropped | Outgoing packets dropped.        |
| container.network.io.usage.rx_errors  | Received errors.                 |
| container.network.io.usage.tx_errors  | Sent errors.                     |
| container.network.io.usage.rx_packets | Packets received.                |
| container.network.io.usage.tx_packets | Packets sent.                    |

:::

## Usage

OpenTelemetry Docker Stats [receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/dockerstatsreceiver) provides a convenient way to collect performance metrics from Docker containers, which can help you monitor the health and performance of your containerized applications.

To start monitoring Docker, you need to configure Docker Stats receiver in `/etc/otel-contrib-collector/config.yaml` using your Uptrace [DSN](../get-started.md#dsn):

```yaml
receivers:
  docker_stats:
    endpoint: unix:///var/run/docker.sock
    collection_interval: 15s
    container_labels_to_metric_labels:
      my.container.label: my-metric-label
      my.other.container.label: my-other-metric-label
    env_vars_to_metric_labels:
      MY_ENVIRONMENT_VARIABLE: my-metric-label
      MY_OTHER_ENVIRONMENT_VARIABLE: my-other-metric-label
    excluded_images:
      - undesired-container
      - /.*undesired.*/
      - another-*-container
    metrics:
      container.cpu.usage.percpu:
        enabled: true
      container.network.io.usage.tx_dropped:
        enabled: false

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
      receivers: [otlp, docker_stats]
      processors: [cumulativetodelta, batch, resourcedetection]
      exporters: [otlp]
```

Note that the config above uses `/var/run/docker.sock` Unix socket to communicate with Docker so you need to make sure the Otel Collector can access it.

Alternatively, you can [configure](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option) Docker daemon to also listen on `0.0.0.0:2375` and adjust the Otel Collector config accordingly:

```yaml
receivers:
  docker_stats:
    endpoint: http://localhost:2375
```

See [documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/dockerstatsreceiver) for more details.

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-6.md)!!!

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Kafka](opentelemetry-kafka.md)
- [OpenTelemetry Kubernetes](opentelemetry-kubernetes.md)

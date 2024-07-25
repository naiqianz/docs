---
title: OpenTelemetry Tomcat Monitoring
description: Monitor your Tomcat server using OpenTelemetry Java agent.
keywords:
  - opentelemetry tomcat
  - opentelemetry apached tomcat
  - tomcat opentelemetry
  - java opentelemetry tomcat
---

# Monitor Apache Tomcat with OpenTelemetry

Using OpenTelemetry with Tomcat, you can instrument your Java web applications running on Tomcat to collect telemetry data and gain insights into their performance. This instrumentation can help you monitor requests, traces, and other metrics to troubleshoot issues, optimize performance, and ensure the reliability of your applications.

![OpenTelemetry Tomcat](/cover/opentelemetry-tomcat.png)

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-1.md)!!!

## OpenTelemetry Java Agent

OpenTelemetry Java Agent is a powerful tool for automatically instrumenting Java applications to collect telemetry data, such as traces and metrics, without requiring code changes. It's an alternative to manual instrumentation and is particularly useful for instrumenting third-party libraries or applications where you don't have direct access to the source code.

You can download the OpenTelemetry Java Agent from the official [GitHub releases page](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases):

```shell
wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

The OpenTelemetry Java Agent will automatically instrument your application and collect telemetry data. You can configure the agent to export this data to various [distributed tracing tools](https://uptrace.dev/blog/distributed-tracing-tools.html) such as Uptrace, OpenTelemetry Collector, Jaeger etc.

## Configuring Tomcat and OpenTelemetry

To customize Apache Tomcat, you can use the `setenv.sh` script that allows you to set environment variables and configure Java Virtual Machine (JVM) options for your Tomcat instance. This script is not included by default but can be created in the Tomcat's `bin` directory.

Create a new file named `setenv.sh` in the Tomcat's `bin` directory with the following content:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/path/to/opentelemetry-javaagent.jar"

export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.uptrace.dev:4317
export OTEL_EXPORTER_OTLP_HEADERS="uptrace-dsn={{ dsn }}"
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```shell
export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/path/to/opentelemetry-javaagent.jar"

export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:14317
export OTEL_EXPORTER_OTLP_HEADERS="uptrace-dsn=http://project2_secret_token@localhost:14318?grpc=14317"
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
</CodeGroup>

Ensure that the `setenv.sh` script is executable. You can do this by running the following command in the `bin` directory:

```shell
chmod +x setenv.sh
```

To apply the changes, you'll need to restart your Tomcat server. Use the `shutdown.sh` script to stop Tomcat and then the `startup.sh` script to start it again:

```shell
./shutdown.sh
./startup.sh
```

You can verify that your environment variables and JVM options are set correctly by checking the Tomcat logs or using utilities like `ps` (on Unix-based systems) to inspect the running Tomcat process and its JVM options.

## OpenTelemetry Backend

Once the metrics are collected and exported, you can visualize them using a compatible backend system. For example, you can use Uptrace to create dashboards that display metrics from the OpenTelemetry Collector.

!!!include(what-is-uptrace-1.md)!!!

## What's next?

!!!include(monitor-what-is-next.md)!!!

- [OpenTelemetry Spring Boot](../instrument/opentelemetry-spring-boot.md)
- [OpenTelemetry Kubernetes](opentelemetry-kubernetes.md)

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

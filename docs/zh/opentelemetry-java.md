# OpenTelemetry Java for Uptrace

<a href="https://github.com/uptrace/uptrace-java" target="_blank">
  <img src="/devicon/java-original.svg" width="200" />
</a>

[[toc]]

## Quickstart

OpenTelemetry Java Agent provides automatic instrumentation and tracing capabilities for Java applications without requiring any code changes. It works by attaching to a Java application at runtime and intercepting method calls to collect telemetry data such as traces and metrics.

OpenTelemetry Java Agent simplifies the process of instrumenting your Java applications to collect telemetry data by eliminating the need to modify your application's source code.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN](get-started.md#dsn) (connection string), for example, `https://token@api.uptrace.dev/project_id`.

**Step 1**. Download the latest pre-compiled Java agent JAR:

```shell
wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

**Step 2**. Configure the agent to export data to Uptrace using environment variables:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
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

**Step 3**. Enable the agent by providing the `-javaagent` flag when starting your app:

```go
java -javaagent:path/to/opentelemetry-javaagent.jar \
     -jar myapp.jar
```

That's it! The agent supports huge number of [libraries and frameworks](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/supported-libraries.md#libraries--frameworks) and a majority of the most popular [application servers](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/supported-libraries.md#application-servers).

## Configuration

The agent can be [configured](https://opentelemetry.io/docs/instrumentation/java/automatic/agent-config/) using environment variables, system properties, or a configuration file.

### Environment variables

For example, you can use environment variables to configure OpenTelemetry:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.uptrace.dev:4317
export OTEL_EXPORTER_OTLP_HEADERS="uptrace-dsn={{ dsn }}"
export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```shell
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:14317
export OTEL_EXPORTER_OTLP_HEADERS="uptrace-dsn=http://project2_secret_token@localhost:14318?grpc=14317"
export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
</CodeGroup>

### System properties

<ProjectPicker v-model="activeProject" :projects="projects" />

Instead of using environment variables, you can also use system properties:

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
java -javaagent:path/to/opentelemetry-javaagent.jar \
     -jar myapp.jar \
     -Dotel.exporter.otlp.endpoint=https://otlp.uptrace.dev:4317 \
     -Dotel.exporter.otlp.headers=uptrace-dsn={{ dsn }} \
     -Dotel.resource.attributes=service.name=myservice,service.version=1.0.0 \
     -Dotel.traces.exporter=otlp \
     -Dotel.metrics.exporter=otlp \
     -Dotel.logs.exporter=otlp \
     -Dotel.exporter.otlp.compression=gzip \
     -Dotel.exporter.otlp.metrics.temporality.preference=DELTA \
     -Dotel.exporter.otlp.metrics.default.histogram.aggregation=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```shell
java -javaagent:path/to/opentelemetry-javaagent.jar \
     -jar myapp.jar \
     -Dotel.exporter.otlp.endpoint=http://localhost:14317 \
     -Dotel.exporter.otlp.headers=uptrace-dsn={{ dsn }} \
     -Dotel.resource.attributes=service.name=myservice,service.version=1.0.0 \
     -Dotel.traces.exporter=otlp \
     -Dotel.metrics.exporter=otlp \
     -Dotel.logs.exporter=otlp \
     -Dotel.exporter.otlp.compression=gzip \
     -Dotel.exporter.otlp.metrics.temporality.preference=DELTA \
     -Dotel.exporter.otlp.metrics.default.histogram.aggregation=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
</CodeGroup>

### Config file

You can also save system properties into a file, for example, `uptrace.properties`:

<ProjectPicker v-model="activeProject" :projects="projects" />

<CodeGroup>
  <CodeGroupItem title="Cloud">

```shell:no-v-pre
otel.exporter.otlp.endpoint=https://otlp.uptrace.dev:4317
otel.exporter.otlp.headers=uptrace-dsn={{ dsn }}
otel.resource.attributes=service.name=myservice,service.version=1.0.0
otel.traces.exporter=otlp
otel.metrics.exporter=otlp
otel.logs.exporter=otlp
otel.exporter.otlp.compression=gzip
otel.exporter.otlp.metrics.temporality.preference=DELTA
otel.exporter.otlp.metrics.default.histogram.aggregation=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
  <CodeGroupItem title="Self-hosted">

```shell
otel.exporter.otlp.endpoint=http://localhost:14317
otel.exporter.otlp.headers=uptrace-dsn=http://project2_secret_token@localhost:14318?grpc=14317
otel.resource.attributes=service.name=myservice,service.version=1.0.0
otel.traces.exporter=otlp
otel.metrics.exporter=otlp
otel.logs.exporter=otlp
otel.exporter.otlp.compression=gzip
otel.exporter.otlp.metrics.temporality.preference=DELTA
otel.exporter.otlp.metrics.default.histogram.aggregation=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

  </CodeGroupItem>
</CodeGroup>

And pass that file to the agent using the `otel.javaagent.configuration-file` system property:

```shell
java -javaagent:path/to/opentelemetry-javaagent.jar \
     -Dotel.javaagent.configuration-file=path/to/uptrace.properties \
     -jar myapp.jar
```

## Micrometer metrics

[Micrometer](https://micrometer.io/) is a metrics collection library for Java-based applications, which provides a simple way to instrument code with various metrics such as timers, gauges, counters, histograms, and distributions.

Some popular frameworks like [Spring Boot](instrument/opentelemetry-spring-boot.md) provide dependency management and auto-configuration for Micrometer out-of-the-box. For other frameworks you need to enable Micrometer metrics first, for example, to monitor [JVM](https://micrometer.io/docs/ref/jvm):

```java
import io.micrometer.core.instrument.Metrics;
import io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmGcMetrics;
import io.micrometer.core.instrument.binder.jvm.ProcessorMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;

new ClassLoaderMetrics().bindTo(Metrics.globalRegistry);
new JvmMemoryMetrics().bindTo(Metrics.globalRegistry);
new JvmGcMetrics().bindTo(Metrics.globalRegistry);
new ProcessorMetrics().bindTo(Metrics.globalRegistry);
new JvmThreadMetrics().bindTo(Metrics.globalRegistry);
```

Then you need to install the OpenTelemetry bridge for Micrometer.

### OpenTelemetry bridge for Micrometer

OpenTelemetry Java agent detects if the instrumented application is using Micrometer and injects a special MeterRegistry implementation to collect Micrometer meters.

To export metrics with the javaagent, you need to add a dependency on the `micrometer-core` library.

For Maven users:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-core</artifactId>
    <version>1.10.5</version>
</dependency>
```

For Gradle users:

```
implementation("io.micrometer:micrometer-core:1.10.5")
```

### Custom metrics

To create custom metrics with Micrometer, use one of meter factory methods provided by the `Metrics` class, or use meter builders and register them in the `Metrics.globalRegistry`:

```java
import io.micrometer.core.instrument.Metrics;

class MyClass {

  Counter myCounter = Metrics.counter("my_custom_counter");
  Timer myTimer = Timer.builder("my_custom_timer").register(Metrics.globalRegistry);

  int foo() {
    myCounter.increment();
    return myTimer.record(this::fooImpl);
  }

  private int fooImpl() {
    // ...
  }
}

```

## Disabling java agent

To disable the agent, pass `-Dotel.javaagent.enabled=false` or use `OTEL_JAVAAGENT_ENABLED=false` environment variable.

You can also suppress specific instrumentations by passing `-Dotel.instrumentation.[name].enabled=false` or using `OTEL_INSTRUMENTATION_[NAME]_ENABLED=false` environment variable. See [documentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/supported-libraries.md#libraries--frameworks) for the list of instrumentation names.

## What's next?

Next, check available OpenTelemetry Java agent [configuration](https://opentelemetry.io/docs/instrumentation/java/automatic/agent-config/) options.

- [OpenTelemetry Spring Boot](instrument/opentelemetry-spring-boot.md)
- [OpenTelemetry Tomcat](monitor/opentelemetry-tomcat.md)

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

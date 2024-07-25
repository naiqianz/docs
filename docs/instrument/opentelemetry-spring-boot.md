---
title: OpenTelemetry Spring Boot
description: By adding OpenTelemetry into your Spring Boot application, you can collect and export telemetry data such as traces and metrics.
keywords:
  - opentelemetry spring boot
  - opentelemetry java spring boot
  - opentelemetry spring boot starter
---

# OpenTelemetry Spring Boot

![OpenTelemetry Spring Boot](/spring-boot/cover.png)

Integrating OpenTelemetry with Spring Boot allows you to capture distributed traces and other telemetry data from your application, providing valuable insights into its performance and behavior in a distributed environment.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-7.md)!!!

## Conduit app

Spring Boot is a popular Java framework that simplifies the development of Java applications. It provides a convention-over-configuration approach and comes with built-in support for dependency injection, configuration management, and several other features.

[RealWorld example app](https://github.com/gothinkster/realworld) is a full-stack application called "Conduit" that consists of a backend that serves JSON API and a frontend UI. There are numerous implementations for different languages and frameworks, but in this tutorial you will be using the Spring backend and the React frontend.

## RealWorld backend

Let's start by downloading the backend source code:

```shell
git clone https://github.com/gothinkster/spring-boot-realworld-example-app.git
```

Then you need to build a JAR from the downloaded source code:

```shell
cd spring-boot-realworld-example-app
./gradlew bootJar
```

If you are getting `Could not find snakeyaml-1.27-android.jar (org.yaml:snakeyaml:1.27)`, apply the following diff to `build.gradle` and try again:

```diff
diff --git a/build.gradle b/build.gradle
index 12781f0..52a8f71 100644
--- a/build.gradle
+++ b/build.gradle
@@ -33,6 +33,7 @@ dependencies {
     implementation 'io.jsonwebtoken:jjwt:0.9.1'
     implementation 'joda-time:joda-time:2.10.6'
     implementation 'org.xerial:sqlite-jdbc:3.34.0'
+    implementation 'org.yaml:snakeyaml:1.28'
```

Now you can start the app using the compiled JAR:

```shell
java -jar build/libs/spring-boot-realworld-example-app-0.0.1-SNAPSHOT.jar
```

You can check that the backend is working by visiting `http://localhost:8080/tags`:

```shell
curl http://localhost:8080/tags
{"tags":[]}
```

Let's stop the app for now by pressing CTRL+C.

## OpenTelemetry Java Agent

To integrate OpenTelemetry with a Spring Boot application, you can use the OpenTelemetry Java Agent, which provides instrumentation for various Java frameworks, including Spring Boot, to automatically collect telemetry data.

OpenTelemetry Java Agent is a standalone process that provides automatic instrumentation and tracing capabilities for Java applications without requiring any code changes. It works by attaching to a Java application at runtime and intercepting method calls to collect telemetry data such as traces and metrics.

The agent sits between the instrumented application and the backend systems or observability platforms, allowing for centralized and streamlined telemetry data handling.

To download the latest OpenTelemetry Agent:

```shell
wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

Otel Agent accepts various [configuration](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/agent-config.md) options either via system properties or environment variables.

## Uptrace

Uptrace is a [open source APM tool](../open-source-apm.md) that supports [OpenTelemetry tracing](https://uptrace.dev/opentelemetry/distributed-tracing.html), [OpenTelemetry metrics](https://uptrace.dev/opentelemetry/metrics.html), and [OpenTelemetry logs](https://uptrace.dev/opentelemetry/logs.html). You can use it to monitor applications and set up alerts to receive notifications via email, Slack, Telegram, and more.

Uptrace DSN (Data Source Name) is a connection string that is used to connect and send data to an Uptrace backend. You can obtain a DSN after [installing Uptrace](../get-started.md) and creating a project.

Use the following environment variables to configure [OpenTelemetry Java](../opentelemetry-java.md) to send data to Uptrace.

```shell
export OTEL_RESOURCE_ATTRIBUTES=service.name=myservice,service.version=1.0.0
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.uptrace.dev:4317
export OTEL_EXPORTER_OTLP_HEADERS=uptrace-dsn=https://token@api.uptrace.dev/project_id
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM
```

Let's start the backend application again, but this time you're going to use the Java Agent to automatically instrument the JAR:

```shell
java -javaagent:opentelemetry-javaagent-all.jar -jar build/libs/spring-boot-realworld-example-app-0.0.1-SNAPSHOT.jar
```

As usually you can open `http://localhost:8080/tags` to check that API is working.

## RealWorld frontend

You have a working backend, but it is not very interesting without a frontend. Let's go ahead and install a [React + Redux](https://github.com/gothinkster/react-redux-realworld-example-app.git) frontend that will serve as a UI:

```shell
git clone https://github.com/gothinkster/react-redux-realworld-example-app.git
```

The app comes with various JS dependencies:

```shell
cd react-redux-realworld-example-app
npm install
```

Now you need to configure the frontend app to use our backend that is running at `http://localhost:8080/`. You can do that by editing `src/agent.js` file:

```js
const API_ROOT = 'http://localhost:8080'
```

After which you can start the React app and enjoy the UI at `http://localhost:4100/register`:

```shell
npm start
```

After clicking a few links you should see traces like this one arriving in your Uptrace project:

![conduit](/spring-boot/conduit.png)

## Conclusion

By using OpenTelemetry Java Agent, you can instrument a Java application without changing a single line of code. Curious to try instrumenting your app? Sign up for a [free Uptrace account](https://app.uptrace.dev/join) and follow this tutorial. Good luck.

- [OpenTelemetry Java](../opentelemetry-java.md)
- [OpenTelemetry Kubernetes](../monitor/opentelemetry-kubernetes.md)

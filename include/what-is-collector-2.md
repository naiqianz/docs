[OpenTelemetry Collector](https://uptrace.dev/opentelemetry/collector.html) is a proxy service between your application and a [distributed tracing tool](https://uptrace.dev/blog/distributed-tracing-tools.html). Collector receives telemetry data, transforms the data, and then exports it to tracing tools that can store the data permanently.

Collector can also act as an agent that pulls telemetry data from monitored systems, for example, Redis or filesystem metrics.

If you are already using OTLP exporter, you can continue to use it with Uptrace by changing some configuration options.

To maximize performance and efficiency, consider the following recommendations when configuring OpenTelemetry SDK.

| Recommendation                                                                                                                        | Signals      | Significance |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ |
| Use `BatchSpanProcessor` to export multiple spans in a single request.                                                                | All          | Essential    |
| Enable `gzip` compression to compress the data before sending and reduce the traffic cost.                                            | All          | Essential    |
| Prefer `delta` metrics temporality, because such metrics are smaller and Uptrace must convert `cumulative` metrics to `delta` anyway. | Metrics      | Recommended  |
| Prefer Protobuf encoding over JSON.                                                                                                   | All          | Recommended  |
| Use AWS X-Ray ID generator for OpenTelemetry.                                                                                         | Traces, Logs | Optional     |

To configure OpenTelemetry to send data to Uptrace, use the provided endpoint and pass the [DSN](/get-started.md#dsn) via `uptrace-dsn` header:

| Transport | Endpoint                      | Port |
| --------- | ----------------------------- | ---- |
| gRPC      | https://otlp.uptrace.dev:4317 | 4317 |
| HTTPS     | https://otlp.uptrace.dev      | 443  |

Most languages allow to configure OTLP exporter using environment variables:

```shell:no-v-pre
# Uncomment the appropriate protocol for your programming language.
# Only for OTLP/gRPC
#export OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp.uptrace.dev:4317"
# Only for OTLP/HTTP
#export OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp.uptrace.dev"

# Pass Uptrace DSN in gRPC/HTTP headers.
export OTEL_EXPORTER_OTLP_HEADERS="uptrace-dsn={{ dsn }}"

# Enable gzip compression.
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip

# Enable exponential histograms.
export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=BASE2_EXPONENTIAL_BUCKET_HISTOGRAM

# Prefer delta temporality.
export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA
```

When configuring `BatchSpanProcessor`, use the following settings:

```shell
# Maximum allowed time to export data in milliseconds.
export OTEL_BSP_EXPORT_TIMEOUT=10000

# Maximum batch size.
# Using larger batch sizes can be problematic,
# because Uptrace rejects requests larger than 20MB.
export OTEL_BSP_MAX_EXPORT_BATCH_SIZE=10000

# Maximum queue size.
# Increase queue size if you have lots of RAM, for example,
# `10000 * number_of_gigabytes`.
export OTEL_BSP_MAX_QUEUE_SIZE=30000

# Max concurrent exports.
# Setting this to the number of available CPUs might be a good idea.
export OTEL_BSP_MAX_CONCURRENT_EXPORTS=2
```

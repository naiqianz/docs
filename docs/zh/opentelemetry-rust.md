# OpenTelemetry Rust distro for Uptrace

<a href="https://github.com/bestgopher/uptrace-rust" target="_blank">
  <img src="/devicon/rust-plain.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry Rust SDK to export spans and metrics to Uptrace using OTLP/gRPC.

[[toc]]

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

!!!include(env-vars.md)!!!

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-rust/tree/master/examples/otlp-traces) is how you can export OpenTelemetry traces to Uptrace following the recommendations above:

```rs
use std::error::Error;
use std::thread;
use std::time::Duration;

use opentelemetry::trace::TraceError;
use opentelemetry::trace::{TraceContextExt, Tracer};
use opentelemetry::{global, Key, KeyValue};
use opentelemetry_otlp::WithExportConfig;
use opentelemetry_sdk::resource::{
    EnvResourceDetector, SdkProvidedResourceDetector, TelemetryResourceDetector,
};
use opentelemetry_sdk::Resource;
use tonic::metadata::MetadataMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    let dsn = std::env::var("UPTRACE_DSN").expect("Error: UPTRACE_DSN not found");
    println!("using DSN: {}", dsn);

    let _ = init_tracer(dsn)?;
    let tracer = global::tracer("app_or_crate_name");

    tracer.in_span("root-span", |cx| {
        thread::sleep(Duration::from_millis(5));

        tracer.in_span("GET /posts/:id", |cx| {
            thread::sleep(Duration::from_millis(10));

            let span = cx.span();
            span.set_attribute(Key::new("http.method").string("GET"));
            span.set_attribute(Key::new("http.route").string("/posts/:id"));
            span.set_attribute(Key::new("http.url").string("http://localhost:8080/posts/123"));
            span.set_attribute(Key::new("http.status_code").i64(200));
        });

        tracer.in_span("SELECT", |cx| {
            thread::sleep(Duration::from_millis(20));

            let span = cx.span();
            span.set_attribute(KeyValue::new("db.system", "mysql"));
            span.set_attribute(KeyValue::new(
                "db.statement",
                "SELECT * FROM posts LIMIT 100",
            ));
        });

        let span = cx.span();
        println!(
            "https://app.uptrace.dev/traces/{}",
            span.span_context().trace_id().to_string()
        );
    });

    global::shutdown_tracer_provider();
    Ok(())
}

fn init_tracer(dsn: String) -> Result<opentelemetry_sdk::trace::Tracer, TraceError> {
    let resource = Resource::from_detectors(
        Duration::from_secs(0),
        vec![
            Box::new(SdkProvidedResourceDetector),
            Box::new(EnvResourceDetector::new()),
            Box::new(TelemetryResourceDetector),
        ],
    );

    let mut metadata = MetadataMap::with_capacity(1);
    metadata.insert("uptrace-dsn", dsn.parse().unwrap());

    opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint("https://otlp.uptrace.dev:4317")
                .with_timeout(Duration::from_secs(5))
                .with_metadata(metadata),
        )
        .with_batch_config(
            opentelemetry_sdk::trace::BatchConfigBuilder::default()
                .with_max_queue_size(30000)
                .with_max_export_batch_size(10000)
                .with_scheduled_delay(Duration::from_millis(5000))
                .build(),
        )
        .with_trace_config(opentelemetry_sdk::trace::config().with_resource(resource))
        .install_batch(opentelemetry_sdk::runtime::Tokio)
}
```

### Exporting metrics

[Here](https://github.com/uptrace/uptrace-rust/tree/master/examples/otlp-metrics) is how you can export OpenTelemetry metrics to Uptrace following the recommendations above:

```rs
use std::error::Error;
use std::thread;
use std::time::Duration;

use opentelemetry::{global, metrics};
use opentelemetry_otlp::{ExportConfig, Protocol, WithExportConfig};
use opentelemetry_sdk::metrics::SdkMeterProvider;
use opentelemetry_sdk::resource::{
    EnvResourceDetector, SdkProvidedResourceDetector, TelemetryResourceDetector,
};
use opentelemetry_sdk::Resource;
use tonic::metadata::MetadataMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    let dsn = std::env::var("UPTRACE_DSN").expect("Error: UPTRACE_DSN not found");
    println!("using DSN: {}", dsn);

    let provider = init_meter_provider(dsn)?;
    global::set_meter_provider(provider);

    let meter = global::meter("app_or_crate_name");
    let histogram = meter.f64_histogram("ex.com.three").init();

    for _i in 1..100000 {
        histogram.record(1.3, &[]);
        thread::sleep(Duration::from_millis(100));
    }

    Ok(())
}

fn init_meter_provider(dsn: String) -> metrics::Result<SdkMeterProvider> {
    let resource = Resource::from_detectors(
        Duration::from_secs(0),
        vec![
            Box::new(SdkProvidedResourceDetector),
            Box::new(EnvResourceDetector::new()),
            Box::new(TelemetryResourceDetector),
        ],
    );

    let mut metadata = MetadataMap::with_capacity(1);
    metadata.insert("uptrace-dsn", dsn.parse().unwrap());

    let export_config = ExportConfig {
        endpoint: "https://otlp.uptrace.dev:4317".to_string(),
        timeout: Duration::from_secs(10),
        protocol: Protocol::Grpc,
    };
    let exporter = opentelemetry_otlp::new_exporter()
        .tonic()
        .with_export_config(export_config)
        .with_metadata(metadata);

    opentelemetry_otlp::new_pipeline()
        .metrics(opentelemetry_sdk::runtime::Tokio)
        .with_exporter(exporter)
        //.with_delta_temporality()
        .with_period(Duration::from_secs(15))
        .with_timeout(Duration::from_secs(5))
        .with_resource(resource)
        .build()
}
```

## Rust tracing

[tokio-rs/tracing](https://github.com/tokio-rs/tracing) is framework for instrumenting Rust programs to collect structured, event-based diagnostic information. It is used by many popular Rust frameworks and libraries.

You can integrate tokio-rs/tracing with OpenTelemetry using the [tracing_opentelemetry](https://docs.rs/tracing-opentelemetry/latest/tracing_opentelemetry/) crate:

```rs
use tracing::{error, span};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::Registry;

// configure OpenTelemetry

// Create a tracing layer with the configured tracer
let tracer = init_tracer(dsn)?;

// Create a tracing layer with the configured tracer
let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);

// Use the tracing subscriber `Registry`, or any other subscriber
// that impls `LookupSpan`
let subscriber = Registry::default().with(telemetry);

// Trace executed code
tracing::subscriber::with_default(subscriber, || {
    // Spans will be sent to the configured OpenTelemetry exporter
    let root = span!(tracing::Level::TRACE, "app_start", work_units = 2);
    let _enter = root.enter();

    error!("This event will be logged in the root span.");
});
```

## Troubleshooting

You can set OpenTelemetry error handler like this:

```rs
opentelemetry::global::set_error_handler(|error| {
    ::tracing::error!(
        target: "opentelemetry",
        "OpenTelemetry error occurred: {:#}",
        anyhow::anyhow!(error),
    );
})
.expect("to be able to set error handler");
```

If you are getting `OpenTelemetry trace error occurred. cannot send span to the batch span processor because the channel is full`, you can tweak `BatchSpanProcessor` config using env variables:

```shell
export OTEL_BSP_MAX_EXPORT_BATCH_SIZE=10000
export OTEL_BSP_MAX_QUEUE_SIZE=30000
export OTEL_BSP_MAX_CONCURRENT_EXPORTS=2
```

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

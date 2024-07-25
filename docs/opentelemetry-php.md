# OpenTelemetry PHP distro for Uptrace

<a href="https://github.com/uptrace/uptrace-php" target="_blank">
  <img src="/devicon/php-original.svg" width="200" />
</a>

This document explains how to configure OpenTelemetry PHP SDK to export spans and metrics to Uptrace using OTLP/HTTP.

To learn about OpenTelemetry API, see [OpenTelemetry PHP Tracing API](https://uptrace.dev/opentelemetry/php-tracing.html) and [OpenTelemetry PHP Metrics API](https://uptrace.dev/opentelemetry/php-metrics.html).

[[toc]]

## Uptrace PHP

[uptrace-php](https://github.com/uptrace/uptrace-php) is a thin wrapper over [opentelemetry-php](https://github.com/open-telemetry/opentelemetry-php) that configures OpenTelemetry SDK to export data to Uptrace. It does not add any new functionality and is provided only for your convenience.

First, install Composer using the [installation instructions](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos) and add the following line to your project's `composer.json` file, as this library has not reached a stable release status yet:

```json
 "minimum-stability": "dev"
```

Then, you can install uptrace-php:

```bash
composer require uptrace/uptrace
```

### Configuration

You can configure Uptrace client using a [DSN](get-started.md#dsn) (Data Source Name) from the project settings page.

```php:no-v-pre
$uptrace = Uptrace\Distro::builder()
    // copy your project DSN here or use UPTRACE_DSN env var
    ->setDsn('{{ dsn }}')
    ->setServiceName('myservice')
    ->setServiceVersion('1.0.0')
    ->setResourceAttributes(['deployment.environment' => 'production'])
    ->buildAndRegisterGlobal();

// Create a tracer. You can have as many tracers as you need.
$tracer = Globals::tracerProvider()->getTracer('app_or_package_name');
```

!!!include(env-vars.md)!!!

### Quickstart

Spend 5 minutes to install OpenTelemetry distro, generate your first trace, and click the link in your terminal to view the trace.

- **Step 0**. [Create](https://app.uptrace.dev/join) an Uptrace project to obtain a DSN (connection string), for example, `https://token@api.uptrace.dev/project_id`.

- **Step 2**. Copy the [code](https://github.com/uptrace/uptrace-php/tree/master/example/basic) to `main.php` replacing the `<dsn>`:

<ProjectPicker v-model="activeProject" :projects="projects" />

```php:no-v-pre
<?php

declare(strict_types=1);
require __DIR__ . '/../../vendor/autoload.php';

use OpenTelemetry\API\Common\Instrumentation\Globals;
use OpenTelemetry\API\Trace\SpanKind;

$uptrace = Uptrace\Distro::builder()
    // copy your project DSN here or use UPTRACE_DSN env var
    ->setDsn('{{ dsn }}')
    ->setServiceName('myservice')
    ->setServiceVersion('1.0.0')
    ->buildAndRegisterGlobal();

// Create a tracer. Usually, tracer is a global variable.
$tracer = Globals::tracerProvider()->getTracer('app_or_package_name');

// Create a root span (a trace) to measure some operation.
$main = $tracer->spanBuilder('main-operation')->startSpan();
// Future spans will be parented to the currently active span.
$mainScope = $main->activate();

$child1 = $tracer->spanBuilder('GET /posts/:id')
                 ->setSpanKind(SpanKind::KIND_SERVER)
                 ->startSpan();
$child1Scope = $child1->activate();
$child1->setAttribute('http.method"', 'GET');
$child1->setAttribute('http.route"', '/posts/:id');
$child1->setAttribute('http.url', 'http://localhost:8080/posts/123');
$child1->setAttribute('http.status_code', 200);
try {
    throw new \Exception('Some error message');
} catch (\Exception $exc) {
    $child1->setStatus('error', $exc->getMessage());
    $child1->recordException($exc);
}
$child1Scope->detach();
$child1->end();

$child2 = $tracer->spanBuilder('child2-of-main')->startSpan();
$child2Scope = $child1->activate();
$child2->setAttributes([
    'db.system' => 'mysql',
    'db.statement' => 'SELECT * FROM posts LIMIT 100',
]);
$child2Scope->detach();
$child2->end();

// End the span and detached context when the operation we are measuring is done.
$mainScope->detach();
$main->end();

echo $uptrace->traceUrl($main) . PHP_EOL;
```

- **Step 3**. Run the [example](https://github.com/uptrace/uptrace-php/tree/master/example/basic) to get a link for the generated trace:

```shell
php main.php
trace URL: https://uptrace.dev/traces/<trace_id>
```

- **Step 4**. Follow the link to view the generated trace:

![Basic trace](/distro/basic-trace.png)

## Already using OTLP exporter?

!!!include(otlp-exporter.md)!!!

### Exporting traces

[Here](https://github.com/uptrace/uptrace-php/tree/master/example/otlp-traces) is how you can export traces to Uptrace following the recommendations above:

```php
<?php

declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\Propagation\TraceContextPropagator;
use OpenTelemetry\SDK\Sdk;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Common\Time\ClockFactory;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Common\Export\TransportFactoryInterface;
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SDK\Trace\SpanProcessor\BatchSpanProcessor;
use OpenTelemetry\SDK\Trace\Sampler\AlwaysOnSampler;
use OpenTelemetry\SDK\Trace\Sampler\ParentBased;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;

$dsn = getenv('UPTRACE_DSN');
if (!$dsn) {
    exit('UPTRACE_DSN environment variable is required');
}
echo 'using DSN: ', $dsn, PHP_EOL;

$resource = ResourceInfoFactory::emptyResource()->merge(
    ResourceInfo::create(Attributes::create([
        "service.name" => "test",
        "service.version" => "1.0.0",
    ])),
    ResourceInfoFactory::defaultResource()
);

$transportFactory = new OtlpHttpTransportFactory();
$transport = $transportFactory->create(
    'https://otlp.uptrace.dev/v1/traces',
    'application/json',
    ['uptrace-dsn' => $dsn],
    TransportFactoryInterface::COMPRESSION_GZIP,
);
$spanExporter = new SpanExporter($transport);

$spanProcessor = new BatchSpanProcessor(
    $spanExporter,
    ClockFactory::getDefault(),
    BatchSpanProcessor::DEFAULT_MAX_QUEUE_SIZE,
    BatchSpanProcessor::DEFAULT_SCHEDULE_DELAY,
    BatchSpanProcessor::DEFAULT_EXPORT_TIMEOUT,
    BatchSpanProcessor::DEFAULT_MAX_EXPORT_BATCH_SIZE,
    true,
);

$tracerProvider = TracerProvider::builder()
    ->addSpanProcessor($spanProcessor)
    ->setResource($resource)
    ->setSampler(new ParentBased(new AlwaysOnSampler()))
    ->build();

Sdk::builder()
    ->setTracerProvider($tracerProvider)
    ->setPropagator(TraceContextPropagator::getInstance())
    ->setAutoShutdown(true)
    ->buildAndRegisterGlobal();

// Create a tracer. Usually, tracer is a global variable.
$tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('app_or_package_name');

// Create a root span (a trace) to measure some operation.
$main = $tracer->spanBuilder('main-operation')->startSpan();
// Future spans will be parented to the currently active span.
$mainScope = $main->activate();

$child1 = $tracer->spanBuilder('GET /posts/:id')
                 ->setSpanKind(SpanKind::KIND_SERVER)
                 ->startSpan();
$child1Scope = $child1->activate();
$child1->setAttribute('http.method"', 'GET');
$child1->setAttribute('http.route"', '/posts/:id');
$child1->setAttribute('http.url', 'http://localhost:8080/posts/123');
$child1->setAttribute('http.status_code', 200);
try {
    throw new \Exception('Some error message');
} catch (\Exception $exc) {
    $child1->setStatus('error', $exc->getMessage());
    $child1->recordException($exc);
}
$child1Scope->detach();
$child1->end();

$child2 = $tracer->spanBuilder('child2-of-main')->startSpan();
$child2Scope = $child1->activate();
$child2->setAttributes([
    'db.system' => 'mysql',
    'db.statement' => 'SELECT * FROM posts LIMIT 100',
]);
$child2Scope->detach();
$child2->end();

// End the span and detached context when the operation we are measuring is done.
$mainScope->detach();
$main->end();

$context = $main->getContext();
echo sprintf('https://app.uptrace.dev/traces/%s', $context->getTraceId()) . PHP_EOL;
```

### Exporting metrics

[Here](https://github.com/uptrace/uptrace-php/tree/master/example/otlp-metrics) is how you can configure OTLP/HTTP exporter for Uptrace following the recommendations above:

```php
<?php

declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Metrics\MeterProvider;
use OpenTelemetry\SDK\Metrics\MetricReader\ExportingReader;
use OpenTelemetry\SDK\Common\Time\ClockFactory;
use OpenTelemetry\SDK\Common\Export\TransportFactoryInterface;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\MetricExporter;

$dsn = getenv('UPTRACE_DSN');
if (!$dsn) {
    exit('UPTRACE_DSN environment variable is required');
}
echo 'using DSN: ', $dsn, PHP_EOL;

$resource = ResourceInfoFactory::emptyResource()->merge(
    ResourceInfo::create(Attributes::create([
        "service.name" => "test",
        "service.version" => "1.0.0",
    ])),
    ResourceInfoFactory::defaultResource()
);

$transportFactory = new OtlpHttpTransportFactory();
$reader = new ExportingReader(
    new MetricExporter(
        $transportFactory->create(
            'https://otlp.uptrace.dev/v1/metrics',
            'application/json',
            ['uptrace-dsn' => $dsn],
            TransportFactoryInterface::COMPRESSION_GZIP,
        )
    ),
    ClockFactory::getDefault()
);

$meterProvider = MeterProvider::builder()
               ->setResource($resource)
               ->addReader($reader)
               ->build();

$meter = $meterProvider->getMeter('app_or_package_name');
$counter = $meter->createCounter('uptrace.demo.counter_name', '', 'counter description');

for ($i = 0; $i < 100000; $i++) {
    $counter->add(1);
    if ($i % 10 === 0) {
        $reader->collect();
    }
    usleep(100);
}
```

### Exporting logs

[Here](https://github.com/uptrace/uptrace-php/tree/master/example/otlp-logs) is how you can export logs to Uptrace following the recommendations above:

```php
<?php

declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use OpenTelemetry\API\Logs\EventLogger;
use OpenTelemetry\API\Logs\LogRecord;
use OpenTelemetry\SDK\Sdk;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Common\Time\ClockFactory;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Common\Export\TransportFactoryInterface;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\BatchLogRecordProcessor;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\LogsExporter;

$dsn = getenv('UPTRACE_DSN');
if (!$dsn) {
    exit('UPTRACE_DSN environment variable is required');
}
echo 'using DSN: ', $dsn, PHP_EOL;

$resource = ResourceInfoFactory::emptyResource()->merge(
    ResourceInfo::create(Attributes::create([
        "service.name" => "test",
        "service.version" => "1.0.0",
    ])),
    ResourceInfoFactory::defaultResource()
);

$transportFactory = new OtlpHttpTransportFactory();

$transport = $transportFactory->create(
    'https://otlp.uptrace.dev/v1/logs',
    'application/json',
    ['uptrace-dsn' => $dsn],
    TransportFactoryInterface::COMPRESSION_GZIP,
);
$exporter = new LogsExporter($transport);

$processor = new BatchLogRecordProcessor(
    $exporter,
    ClockFactory::getDefault(),
);

$loggerProvider = LoggerProvider::builder()
    ->setResource($resource)
    ->addLogRecordProcessor($processor)
    ->build();

Sdk::builder()
    ->setLoggerProvider($loggerProvider)
    ->setAutoShutdown(true)
    ->buildAndRegisterGlobal();

$logger = $loggerProvider->getLogger('demo', '1.0', 'http://schema.url', [/*attributes*/]);
$eventLogger = new EventLogger($logger, 'my-domain');

$record = (new LogRecord('hello world'))
    ->setSeverityText('INFO')
    ->setAttributes([/*attributes*/]);
$eventLogger->logEvent('foo', $record);
```

## What's next?

!!!include(next-php.md)!!!

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

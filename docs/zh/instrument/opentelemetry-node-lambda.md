---
title: OpenTelemetry Node.js AWS Lambda
---

<CoverImage title="Monitor AWS Lambda Node.js with OpenTelemetry" />

AWS Lambda simplifies serverless application development by abstracting away the infrastructure management, allowing developers to focus on writing code and responding to events.

By leveraging OpenTelemetry with AWS Lambda, you can gain deeper visibility into the execution and interactions of your serverless functions, making it easier to identify and troubleshoot performance bottlenecks or issues within your application.

[[toc]]

## What is OpenTelemetry?

!!!include(what-is-opentelemetry-3.md)!!!

## AWS Lambda instrumentation

To instrument your Node.js lambda function, create a separate file called `otel.js` and put the OpenTelemetry initialization code there:

```js
// The very first import must be Uptrace/OpenTelemetry.
const uptrace = require('@uptrace/node')
const otel = require('@opentelemetry/api')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { AwsLambdaInstrumentation } = require('@opentelemetry/instrumentation-aws-lambda')

// Start OpenTelemetry SDK and invoke instrumentations to patch the code.
uptrace.configureOpentelemetry({
  // copy your project DSN here or use UPTRACE_DSN env var
  //dsn: '{{ dsn }}',
  serviceName: 'myservice',
  serviceVersion: '1.0.0',
  deploymentEnvironment: 'production',
  instrumentations: [
    getNodeAutoInstrumentations(),
    new AwsLambdaInstrumentation({
      // Disable reading the X-Ray context headers.
      disableAwsContextPropagation: true,
    }),
  ],
})
```

Next, we need to configure AWS Lambda to load the OpenTelemetry code before the application code using the `--require` flag.

If you use serverless, here is the `serverless.yml` file with the relevant `NODE_OPTIONS` env variable:

```yaml
service: lambda-otel-example
frameworkVersion: '2'
provider:
  name: aws
  runtime: nodejs12.x
  lambdaHashingVersion: 20201221
  environment:
    NODE_OPTIONS: --require otel
  region: eu-west-2
functions:
  otel-lambda-example:
    handler: handler.hello
```

Otherwise, you can use AWS Console or CLI to [configure](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) `NODE_OPTIONS` environment variable.

```shell
aws lambda update-function-configuration --function-name otel-lambda-example \
    --environment "Variables={NODE_OPTIONS=--require otel}"
```

## OpenTelemetry Lambda

Alternatively, you can add [opentelemetry-lambda](https://github.com/open-telemetry/opentelemetry-lambda) as a Lambda layer, but it does not offer any advantages at the moment. See the [example](https://github.com/open-telemetry/opentelemetry-lambda/tree/main/nodejs) for details.

## What is Uptrace?

!!!include(what-is-uptrace-4.md)!!!

## What's next?

!!!include(next-node.md)!!!

- [OpenTelemetry Express](opentelemetry-express.md)
- [Datadog Alternatives](https://uptrace.dev/blog/datadog-alternatives.html)

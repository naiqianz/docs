If OpenTelemetry is not working as expected, you can enable verbose logging to check for potential issues:

```js
const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api')
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)
```

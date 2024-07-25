# Recording errors and exceptions with OpenTelemetry

![Exceptions monitoring](/exceptions/cover.png)

[[toc]]

## Recording exceptions

To record errors and exceptions with OpenTelemetry, you need to:

- Get the active span.
- Call `recordError` function.
- Optionally, set the span status code and message.

### Go

```go
import (
	"go.opentelemetry.io/otel/trace"
	"go.opentelemetry.io/otel/codes"
)

// Get the active span from the context.
span = trace.SpanFromContext(ctx)

if err != nil {
	// Record the error.
	span.RecordError(err)

	// Update the span status.
	span.SetStatus(codes.Error, err.Error())
}
```

See [Go Tracing API](https://uptrace.dev/opentelemetry/go-tracing.html) for details.

### Python

```python
from opentelemetry import trace

span = trace.get_current_span()

except ValueError as exc:
    # Record the exception and update the span status.
    span.record_exception(exc)
    span.set_status(trace.Status(trace.StatusCode.ERROR, str(exc)))
```

See [Python Tracing API](https://uptrace.dev/opentelemetry/python-tracing.html) for details.

### Ruby

```ruby
require 'opentelemetry'

span = OpenTelemetry::Trace.current_span

rescue Exception => e
  # Record the exception and update the span status.
  span.record_exception(e)
  span.status = OpenTelemetry::Trace::Status.error(e.to_s)
end
```

See [Ruby Tracing API](https://uptrace.dev/opentelemetry/ruby-tracing.html) for details.

### Java

```java
import io.opentelemetry.api;

Span span = Span.current()

} catch (Throwable throwable) {
  span.setStatus(StatusCode.ERROR, "Something bad happened!");
  span.recordException(throwable);
}
```

See [Java Tracing API](https://opentelemetry.io/docs/instrumentation/java/manual/) for details.

### .NET

```csharp
var activity = Activity.Current;

catch (Exception ex)
{
    activity?.RecordException(ex);
    activity?.SetStatus(Status.Error.WithDescription(ex.Message));
}
```

See [.NET Tracing API](https://uptrace.dev/opentelemetry/dotnet-tracing.html) for details.

### JavaScript

```js
const otel = require('@opentelemetry/api')

const span = otel.trace.getSpan(otel.context.active())

} catch (exc) {
  // Record the exception and update the span status.
  span.recordException(exc)
  span.setStatus({ code: otel.SpanStatusCode.ERROR, message: String(exc) })
}
```

See [JavaScript Tracing API](https://uptrace.dev/opentelemetry/js-tracing.html) for details.

### PHP

```php
use OpenTelemetry\API\Trace\Span;

$span = Span::getCurrent();

} catch (\Exception $exc) {
    $span->setStatus("error", $exc->getMessage());
    $span->recordException($exc);
}
```

See [PHP Tracing API](https://uptrace.dev/opentelemetry/php-tracing.html) for details.

## Grouping exceptions together

You can control how Uptrace groups exception together by providing `grouping.fingerprint` attribute which can be a string or a number (hash/id):

```toml
exception.type = "RuntimeError"
exception.message = "operation failed: 123 456 789"
grouping.fingerprint = "operation failed"
```

## How to view exceptions?

Exceptions are displayed together with `ERROR` logs. To view exceptions:

- In Uptrace UI, go to the "Traces & Logs" tab.

- Click on the "Logs" button.

- Select the "log:error" system.

- Add `where _event_name = "exception"` or `where exception_type exists` to select exceptions.

![Exceptions UI](/exceptions/ui.png)

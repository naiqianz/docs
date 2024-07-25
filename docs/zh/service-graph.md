# Service graph

Service Graphs provide a visual representation of service interactions, dependencies, and performance metrics. Service graphs are built by analyzing span relationships and require specific span attributes.

![Service graph](/cover/service-graph.png)

To have a service graph or to improve the quality of the existing service graph, consider adding the following attributes.

### General attributes

- `service.name` is an attribute that represents the logical name of the service. Required.

- `_kind` (`span_kind`) categorizes the type of work being represented by the span. Make sure your traces have `client/server` or `producer/consumer` span pairs. Required.

- `_status_code` (`span_status_code`) provides information about the result of a specific operation or unit of work represented by this span. This attribute helps to monitor and understand the success, failure, or other conditions of a given operation. Recommended.

### RPC calls

- `rpc.service` represents the full (logical) name of the service being called. Optional.

### DB calls

- `db.name` contains the name of the database being accessed. Recommended if you have multiple databases.

### HTTP calls

- `server.socket.domain` represents the domain name of an immediate peer. Required for HTTP calls.

- `server.socket.address` represents the physical server IP address or Unix socket address. Required for HTTP calls if `server.socket.domain` is not provided.

### Messaging calls

- `messaging.destination.name` is the message destination name, for example, `MyQueue`, `MyTopic`.

- `messaging.client_id` is a unique identifier for the client that consumes or produces a message.

- `messaging.kafka.consumer.group` is the name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.

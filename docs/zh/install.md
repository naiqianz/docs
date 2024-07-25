---
title: Install Uptrace
---

# Install Uptrace

![Install Uptrace](/install/cover.png)

To install Uptrace on your computer, you need to:

1. Create a [ClickHouse](#clickhouse) database to store telemetry data.
2. Create a [PostgreSQL](#postgresql) database to store users and projects.
3. [Install](#installation) Uptrace binary.
4. [Start sending data](#start-sending-data) using OpenTelemetry protocol.
5. Enjoy! :tada:

<!-- prettier-ignore -->
::: tip
[Docker](https://github.com/uptrace/uptrace/tree/master/example/docker) example can get you started with Uptrace in no time. If you are using Kubernetes, you can also try [Uptrace Helm chart](https://github.com/uptrace/helm-charts).
:::

[[toc]]

## Configuration

All Uptrace configuration is done with a single YAML file that can be downloaded from [GitHub](https://github.com/uptrace/uptrace/blob/master/config/uptrace.dist.yml):

```shell
wget https://raw.githubusercontent.com/uptrace/uptrace/master/config/uptrace.dist.yml
mv uptrace.dist.yml uptrace.yml
```

You can then specify the config file location when starting Uptrace:

```shell
uptrace --config=/path/to/uptrace.yml serve
```

See [Configuration](config.md) for more details.

## ClickHouse

Uptrace requires a ClickHouse database to store telemetry data such as traces, logs, and metrics. ClickHouse is an open source columnar database management system designed to handle large amounts of data and execute complex analytical queries with low latency.

After [installing](https://clickhouse.com/docs/en/getting-started/install/) ClickHouse, you can create `uptrace` database like this:

```shell
clickhouse-client -q "CREATE DATABASE uptrace"
```

On startup, Uptrace connects to the ClickHouse database specified in the `uptrace.yml` configuration file and automatically creates the required tables and views.

```yaml
# uptrace.yml

ch:
  addr: localhost:9000
  user: default
  password:
  database: uptrace
```

## PostgreSQL

Uptrace also requires a PostgreSQL database to store metadata such as metric names and alerts. Typically, the PostgreSQL database requires only a few megabytes of disk space.

After installing PostgreSQL, you can create database like this:

```shell
sudo -u postgres psql
postgres=# create database uptrace;
postgres=# create user uptrace with encrypted password 'uptrace';
postgres=# grant all privileges on database uptrace to uptrace;
postgres=# \c uptrace
postgres=# grant all on schema public to uptrace;
```

On startup, Uptrace connects to the PostgreSQL database specified in the `uptrace.yml` configuration file and automatically creates the required tables and views.

```yaml
# uptrace.yml

pg:
  addr: localhost:5432
  user: uptrace
  password: uptrace
  database: uptrace
```

## Installation

### Packages

Uptrace provides [DEB](#deb) and [RPM](#rpm) packages for Linux amd64/arm64 systems. After installing the approriate package, you will have:

- Uptrace binary at `/usr/bin/uptrace`.
- Uptrace config at `/etc/uptrace/uptrace.yml`.
- Systemd service at `/lib/systemd/system/uptrace.service`.
- Environment file used by the systemd service at `/etc/uptrace/uptrace.conf`.

To check the status of Uptrace service:

```shell
sudo systemctl status uptrace
```

To restart Uptrace:

```shell
sudo systemctl restart uptrace
```

To view Uptrace logs:

```shell
sudo journalctl -u uptrace -f
```

#### DEB

To install Debian package, run the following command replacing <code>{{ uptrace.version }}</code> with the desired version and `amd64` with the desired architecture:

```shell:no-v-pre
wget https://github.com/uptrace/uptrace/releases/download/v{{ uptrace.version }}/uptrace_{{ uptrace.version }}_amd64.deb
sudo dpkg -i uptrace_{{ uptrace.version }}_amd64.deb
```

#### RPM

To install RPM package, run the following command replacing <code>{{ uptrace.version }}</code> with the desired version and `x86_64` with the desired architecture:

```shell:no-v-pre
wget https://github.com/uptrace/uptrace/releases/download/v{{ uptrace.version }}/uptrace-{{ uptrace.rpmVersion }}-1.x86_64.rpm
sudo rpm -ivh uptrace-{{ uptrace.rpmVersion }}-1.x86_64.rpm
```

### Binaries

Alternatively, instead of installing [DEB](#deb) or [RPM](#rpm) packages, you can [download](https://github.com/uptrace/uptrace/releases) a pre-compiled binary and install Uptrace manually.

- [Linux](#linux)
- [MacOS](#macos)
- [Windows](#windows)

#### Linux

Download Linux binary:

```shell:no-v-pre
wget -O ./uptrace https://github.com/uptrace/uptrace/releases/download/v{{ uptrace.version }}/uptrace_linux_amd64
chmod +x ./uptrace
```

Download Uptrace config:

```shell
wget https://raw.githubusercontent.com/uptrace/uptrace/master/config/uptrace.dist.yml
mv uptrace.dist.yml uptrace.yml
```

Start Uptrace:

```shell
./uptrace --config=uptrace.yml serve
```

#### MacOS

Download MacOS binary:

```shell:no-v-pre
wget -O uptrace https://github.com/uptrace/uptrace/releases/download/v{{ uptrace.version }}/uptrace_darwin_amd64
chmod +x uptrace
```

Download Uptrace config:

```shell
wget https://raw.githubusercontent.com/uptrace/uptrace/master/config/uptrace.dist.yml
mv uptrace.dist.yml uptrace.yml
```

Start Uptrace:

```shell
./uptrace --config=uptrace.yml serve
```

You may need to update ClickHouse connection string in `uptrace.yml` using `ch.dsn` option.

#### Windows

Download Windows binary:

```shell:no-v-pre
curl uptrace https://github.com/uptrace/uptrace/releases/download/v{{ uptrace.version }}/uptrace_windows_amd64.exe
```

Download Uptrace config:

```shell
curl https://raw.githubusercontent.com/uptrace/uptrace/master/config/uptrace.dist.yml
mv uptrace.dist.yml uptrace.yml
```

Start Uptrace:

```shell
uptrace_windows_amd64.exe --config=uptrace.yml serve
```

You may need to update ClickHouse connection string in `uptrace.yml` using `ch.dsn` option.

#### Other

For pre-compiled binaries for other platforms, check [GitHub Releases](https://github.com/uptrace/uptrace/releases).

## Start sending data

To start sending data, you can use OpenTelemetry distros that are pre-configured to work with Uptrace. Uptrace uses OpenTelemetry protocol (OTLP) to receive telemetry data such as [traces](https://uptrace.dev/opentelemetry/distributed-tracing.html#spans), [metrics](https://uptrace.dev/opentelemetry/metrics.html), and [logs](https://uptrace.dev/opentelemetry/logs.html). As a transport protocol, OTLP can use gRPC (**OTLP/gRPC**) or HTTP (**OTLP/HTTP**).

Uptrace supports OTLP/gRPC on the port `14317` and OTLP/HTTP on the port `14318`. Both ports are specified in the Uptrace DSN that you will receive after installing Uptrace, for example:

```shell
UPTRACE_DSN=http://project2_secret_token@localhost:14318?grpc=14317
```

| Distro                                                         | Protocol  | Port  |
| -------------------------------------------------------------- | --------- | ----- |
| [OpenTelemetry Go](/opentelemetry-go.md)                       | OTLP/gRPC | 14317 |
| [OpenTelemetry .NET](/opentelemetry-dotnet.md)                 | OTLP/gRPC | 14317 |
| [OpenTelemetry Python](/opentelemetry-python.md)               | OTLP/gRPC | 14317 |
| [OpenTelemetry Rust](/opentelemetry-rust.md)                   | OTLP/gRPC | 14317 |
| [OpenTelemetry Node.js](/opentelemetry-js-node.md)             | OTLP/HTTP | 14318 |
| [OpenTelemetry Ruby](/opentelemetry-ruby.md)                   | OTLP/HTTP | 14318 |
| [OpenTelemetry Java](/opentelemetry-java.md)                   | OTLP/HTTP | 14317 |
| [OpenTelemetry PHP](/opentelemetry-php.md)                     | OTLP/HTTP | 14318 |
| [OpenTelemetry Erlang/Elixir](/opentelemetry-erlang-elixir.md) | OTLP/gRPC | 14317 |

!!!include(devicons-uptrace-distro.md)!!!

## GitHub notifications

To get notified about a new Uptrace release, star the [uptrace/uptrace](https://github.com/uptrace/uptrace) repo and subscribe to notifications.

1. Click on "Watch" -> "Custom".
2. Select "Releases".
3. Click on "Apply" to save changes.

![GitHub notifications](/install/github-notifications.png)

## What's next?

Next, learn how to [configure](config.md) Uptrace for your needs or browse available [OpenTelemetry instrumentations](instrument/README.md) to find examples for your frameworks and libraries.

<script type="ts">
import { defineComponent } from 'vue'

import { useUptraceBinary } from '@/use/uptrace-binary'

export default defineComponent({
  setup() {
    const uptrace = useUptraceBinary()
    return { uptrace }
  },
})
</script>

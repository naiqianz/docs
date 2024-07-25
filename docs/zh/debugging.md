---
title: Debugging Uptrace issues
---

<CoverImage title="Debugging Uptrace issues" />

[[toc]]

## Uptrace version

Before trying anything else, make sure you have the latest Uptrace version.

To see the installed Uptrace version:

```shell
uptrace version
```

You can check the latest available version at [GitHub Releases](https://github.com/uptrace/uptrace/releases).

## Uptrace config

You can view the config Uptrace uses with the following command:

```yaml
uptrace config dump
```

## Logging

You can view Uptrace logs using `journalctl` command:

```shell
sudo journalctl -u uptrace -f
```

To check the status of the service:

```shell
sudo systemctl status uptrace
```

By default, Uptrace only logs failed HTTP requests and failed ClickHouse queries. You can configure Uptrace to log all incoming HTTP requests with an env variable:

```shell
HTTPDEBUG=2 uptrace serve
```

To log all ClickHouse queries:

```shell
CHDEBUG=2 uptrace serve
```

To log all PostgreSQL queries:

```shell
PGDEBUG=2 uptrace serve
```

## Resetting ClickHouse database

If ClickHouse queries are failing, you can try to to reset ClickHouse database:

```shell
uptrace ch reset
```

The check the database status:

```shell
uptrace ch status
```

## Resetting PostgreSQL database

Just like with ClickHouse, you can reset the PostgreSQL database that Uptrace uses to store metadata:

```shell
uptrace pg reset
```

The check the database status:

```shell
uptrace pg status
```

## Kafka queues

[Uptrace Enterprise Edition](enterprise.md) uses Kafka to queue incoming data for asynchronous processing.

Use the following command to check the number of unprocessed messages in the queues (the "LAG" column):

```shell
/usr/local/kafka/bin/kafka-consumer-groups.sh --describe --group kafkaq --bootstrap-server 127.0.0.1:9092

GROUP           TOPIC                    PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                              HOST            CLIENT-ID
kafkaq          prod.v1.spans            0          76450884876     76450904337     19461           kgo-abf6bc0b-489c-45bc-ac67-80a6f05c2fdb /10.0.1.1       kgo
kafkaq          prod.v1.datapoints       0          50385576786     50385587980     11194           kgo-f659dd2f-9c65-4408-95c6-9107178ce362 /10.0.1.1       kgo

```

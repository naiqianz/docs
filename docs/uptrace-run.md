---
title: Monitoring command execution
---

<CoverImage title="Monitoring command execution" />

## Introduction

If you have a script or a binary that you can't instrument, Uptrace provides a wrapper that executes a command saving an exit code, stdout, and stderr. If a command exits with a non-zero exit code, Uptrace will send you a notification.

```shell
UPTRACE_DSN="" uptrace-run -cmd="sleep 1 && echo hello" -timeout=1m
```

The `timeout` option specifies command execution timeout. Timeout is an interval of time after which Uptrace aborts command execution and marks command as failed.

## Installation

`uptrace-run` requires a recent version of Go:

```shell
GO111MODULE=on go get github.com/uptrace/uptrace-go/cmd/uptrace-run@latest
```

Go saves the compiled binary in `$GOPATH/bin`:

```shell
go env GOPATH`/bin/uptrace-run -help
```

The [source code](https://github.com/uptrace/uptrace-go/blob/master/cmd/uptrace-run/uptrace-run.go) is available at GitHub.

---
sitemap: false
---

# Uptrace On-Premise

![Uptrace On-Premise](/cover/on-premise.png)

[[toc]]

## Overview

Uptrace Cloud is the easiest way to run Uptrace, but it can't fit all needs and can be rather expensive for very large customers with petabytes of data and millions of timeseries.

Uptrace On-Premise is an installation of [Uptrace Enterprise](enterprise.md) that is customized to your needs and maintained by Uptrace engineers.

## What is provided

Uptrace can be installed on dedicated servers or in the cloud of your choice. Either way Uptrace engineers will need SSH access to the servers. All SSH activity will be recorded and can be audited later.

SSH access can be revoked at any time, but then the Uptrace team won't be able to maintain the software. It will continue to work though.

Our on-premise offer includes:

- Free 2 months evaluation period.
- Custom data retention for traces and metrics.
- Custom indexing and pre-aggregation rules.
- Standard support: 16/5 free assistance with a possibility to upgrade to 24/7. Support with tickets, or via Slack, or email.
- On-demand SOC 2 certification, for which a separate fee is charged. In practice, this means you pay for SOC 2 certification when you need it. You can also choose to audit Uptrace servers as a part of your infrastructure.

The support will help you with:

- On-boarding and configuring OpenTelemetry for Uptrace.
- Creating custom dashboards.
- Configuring available integrations such us PagerDuty, Opsgenie, Okta, SAML, OIDC, etc.

Uptrace is responsible for scaling and maintaining the service at 99.95% availability. Note that the Uptrace availability cannot be higher than your hosting provider's availability and does not take it into account. So if [AWS is down](https://awsmaniac.com/aws-outages/), so is Uptrace.

If necessary, Uptrace can provide higher availability, for example, using cross-regional replication, but it might double the cost and does not seem to be worthwhile since OpenTelemetry is designed to work properly even if a backend is unavailable.

## Pricing model

The price is based on the amount of ingested data. Large scale installations automatically receive a discount.

The price may change if you need higher support/SLA requirements or require a custom hosting model.

The price does not depend on the number of users, hosts, or services, i.e. you can have an unlimited number of users.

The minimum Uptrace fee is **$1000 per month** and does not include the cost of hosting. For example, if you only ingest $500 worth of data, you will still pay $1000.

## Hosting model

The final terms heavily depend on the hosting model and the hosting provider name, because different providers have different server flavors, services (S3), and pricing models.

1. If you need to comply with strict regulatory laws, you can choose to host Uptrace in your infrastructure and only provide access to the servers in the initial installation phase. This is the simplest case where you pay directly for the Uptrace hosting as a part of your infrastructure.

2. If you are using a specific hosting provider such as AWS, you will probably want Uptrace to be hosted there as well. Using this option, you can choose to pay for the servers directly or let Uptrace manage it for you.

3. Finally, if you don't need to comply with government regulations and don't have a preference for a hosting provider, Uptrace can fully manage a private cloud installation for you in Germany or USA using the Hetzner provider. This is the most cost effective option.

Financially, the last option only makes sense if you want to reduce your large Uptrace Cloud bill, but it also applies to the first 2 options as well. Otherwise, the [public cloud](https://uptrace.dev/pricing) can offer better terms.

## Usage tiers

### Spans and logs

Spans and logs are billed for the number of ingested gigabytes. A single span is usually about 500-1000 bytes.

The prices below are per month, for example, 35TB per month will cost you $900 in Uptrace fees. Hosting costs are paid separately and depend on your hosting provider's pricing.

| Spans and logs | Cloud  | On-premise | Hardware requirements                |
| -------------- | ------ | ---------- | ------------------------------------ |
| 35 terabytes   | $1500  | $900       | 24 vCPU 48GB RAM 1TB SSD 6TB HDD     |
| 60 terabytes   | $2000  | $1200      | 32 vCPU 96GB RAM 2TB SSD 12TB HDD    |
| 100 terabytes  | $3200  | $2000      | 64 vCPU 160GB RAM 4TB SSD 20TB HDD   |
| 500 terabytes  | $15000 | $7500      | 192 vCPU 576GB RAM 8TB SSD 100TB HDD |

For comparison, Grafana Cloud charges $0.50 per gigabyte: 35000 gigabytes \* $0.5 = $17500.

### Timeseries

Metrics are billed for the number of active timeseries, for example, 100 metrics \* 100 hosts is 10000 timeseries.

The prices below are per month, for example, 1.5m timeseries per month will cost you $900 in Uptrace fees. Hosting costs are paid separately and depend on your hosting provider's pricing.

| Timeseries   | Cloud  | On-premise | Hardware requirements                |
| ------------ | ------ | ---------- | ------------------------------------ |
| 1.5 millions | $1500  | $900       | 24 vCPU 48GB RAM 1TB SSD 6TB HDD     |
| 2.5 millions | $2000  | $1200      | 32 vCPU 96GB RAM 2TB SSD 12TB HDD    |
| 4.1 millions | $3200  | $2000      | 64 vCPU 160GB RAM 4TB SSD 20TB HDD   |
| 20 millions  | $15000 | $7500      | 192 vCPU 576GB RAM 8TB SSD 100TB HDD |

For comparison, Grafana Cloud charges $8 per 1k timeseries: 1.5 millions / 1000 \* 8 = $12000.

## Evaluation period

The evaluation period is free of charge, lasts 2 months, and requires only the signing of a [mutual non-disclosure agreement](https://docs.google.com/document/d/1gSGXSjfffQNo_YqrJIyejyk-HqniEVhN/edit).

You also need to provide the following information:

- The amount of ingested data or your budget in USD.
- The domain address for the Uptrace UI. Public domains will receive a free TLS certificate from Let's Encrypt.
- The server must have these 3 ports open: `80`, `443`, and `4317`.

Once all details are finalized, your on-premises installation should be available within 3 business days.

## Get a quote

To get an estimate, please [send](mailto:support@uptrace.dev) us an email or [schedule](https://calendly.com/vmihailenco/30min) a call providing the following information:

- Your chosen [hosting model](#hosting-model) and the name of your hosting provider (AWS, Azure, GCP, etc).
- Number of ingested gigabytes for spans and logs.
- Number of timeseries for metrics.

To get an idea how much data you ingest, you can [create a free account](https://uptrace.dev/join) or install [Uptrace Comminity Edition](get-started.md).

## How do you bill?

Uptrace uses [Paddle](https://www.paddle.com/) for billing and handling global tax compliance. Paddle uses a [merchant of record](https://www.paddle.com/resources/merchant-of-record-a-guide-for-cfos) (MoR) model to provide an all-in-one payments, billing, and sales tax solution for software businesses.

You can pay using a bank card or we can send you an invoice which you can pay using a bank transfer.

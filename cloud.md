# Uptrace Cloud limits

Uptrace Cloud is a public installation of [Uptrace Enterprise](enterprise.md) maintained by Uptrace creators.

[[toc]]

## Data storage

Uptrace uses Hetzner's Germany data center to process and store your data according to our [privacy policy](privacy.md).

Uptrace uses tiered storage for your data:

- First, the data is written to fast NVME SSD disks (hot storage).
- Later, it is moved to HDD-based storage (cold storage).

Uptrace aims to store at least 1 week of data on hot storage before moving it to cold storage. Cold storage does not necessarily mean slow, as a single storage server has up to 15 hard drives, which helps with query performance.

The data on the hot storage is replicated twice, i.e. it is stored on 2 different servers in 2 different data centers.

The data on the cold storage uses Reed-Solomon erasure coding with 4 parity chunks written on different disks in different data centers. It allows to lose 4 shards of data (4 disks).

Data is encrypted using AES256-GCM. If disks are lost or stolen, the data can't be read back.

## Limits

Because you're sharing server resources with other Uptrace Cloud users, Uptrace imposes certain limits on your queries to ensure a good experience for everyone.

The limits below apply to Uptrace Cloud users only. [On-premise](on-premise.md) and self-hosted installations can customize or disable the limits.

### Query limits

Uptrace Cloud queries must be completed within 30 seconds. If the query times out, Uptrace enables data sampling and retries it.

Maximum RAM usage is limited to 16 gigabytes for a single query.

### Fair usage limits

Uptrace ensures fair usage by tracking the duration of your queries over the last 5 minutes. If the total duration exceeds a certain threshold, you will be prevented from making any further queries for the remaining 5 minutes.

Uptrace uses a large enough threshold to ensure that the limit is only applied to long running queries.

This limit does not apply to [metric monitors](alerting.md) and other queries run by Uptrace itself.

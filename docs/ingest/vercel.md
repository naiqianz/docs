# Sending Vercel logs to Uptrace

![Ingest Vercel Logs](/cover/ingest-vercel.png)

Vercel is a cloud platform that provides serverless deployment and hosting for web applications. It provides a seamless way to build, deploy and scale websites or web applications with a focus on front-end development.

Vercel [log drains](https://vercel.com/docs/concepts/observability/log-drains-overview/log-drains) allow you to centralize log data from your applications, which makes it easier to debug, monitor, and analyze. Once a new log line is created, these logs can then be forwarded to archival, search, and alerting services.

Uptrace supports Vercel log drains on the following endpoint:

<ProjectPicker v-model="activeProject" :projects="projects" />

```yaml:no-v-pre
method: POST
endpoint: https://api.uptrace.dev/api/v1/vercel/logs
headers: { 'uptrace-dsn': '{{ dsn }}' }
format: NDJSON
```

See Vercel [documentation](https://vercel.com/docs/concepts/observability/log-drains-overview/log-drains#configure-a-log-drain) for details.

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

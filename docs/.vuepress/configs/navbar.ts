import type { NavbarConfig } from '@vuepress/theme-default'

export const en: NavbarConfig = [
  {
    text: 'Home',
    link: '/open-source-apm.html',
  },
  {
    text: 'Ingest',
    children: [
      { text: 'OpenTelemetry SDK', link: '/ingest/opentelemetry.html' },
      { text: 'Otel Collector', link: '/ingest/collector.html' },
      { text: 'Vector Logs (Heroku, Fly)', link: '/ingest/vector.html' },
      { text: 'FluentBit', link: '/ingest/fluent-bit.html' },
      { text: 'Prometheus', link: '/ingest/prometheus.html' },
      { text: 'Sentry SDK', link: '/ingest/sentry.html' },
      { text: 'AWS CloudWatch', link: '/ingest/aws-cloudwatch.html' },
      { text: 'Heroku Logs', link: '/ingest/heroku.html' },
      { text: 'Vercel Logs', link: '/ingest/vercel.html' },
      { text: 'Loki & Promtail', link: '/ingest/loki.html' },
    ],
  },
  {
    text: 'Langs',
    children: [
      { text: 'Go', link: '/opentelemetry-go.html' },
      { text: 'Python', link: '/opentelemetry-python.html' },
      { text: 'Ruby', link: '/opentelemetry-ruby.html' },
      { text: 'Node.js', link: '/opentelemetry-js-node.html' },
      { text: 'JS for Web', link: '/opentelemetry-js-web.html' },
      { text: '.NET', link: '/opentelemetry-dotnet.html' },
      { text: 'Java', link: '/opentelemetry-java.html' },
      { text: 'Erlang and Elixir', link: '/opentelemetry-erlang-elixir.html' },
      { text: 'PHP', link: '/opentelemetry-php.html' },
      { text: 'Rust', link: '/opentelemetry-rust.html' },
    ],
  },

  {
    text: 'Instrument',
    link: '/instrument/',
  },

  {
    text: 'Monitor',
    children: [
      {
        text: 'HTTP endpoints',
        link: '/monitor/opentelemetry-httpcheck.html',
      },
      {
        text: 'Kubernetes',
        link: '/monitor/opentelemetry-kubernetes.html',
      },
      {
        text: 'Docker',
        link: '/monitor/opentelemetry-docker.html',
      },
      {
        text: 'Redis',
        link: '/monitor/opentelemetry-redis.html',
      },
      {
        text: 'PostgreSQL',
        link: '/monitor/opentelemetry-postgresql.html',
      },
      {
        text: 'MySQL',
        link: '/monitor/opentelemetry-mysql.html',
      },
      {
        text: 'Kafka',
        link: '/monitor/opentelemetry-kafka.html',
      },
      {
        text: 'PHP-FPM',
        link: '/monitor/opentelemetry-php-fpm.html',
      },
      {
        text: 'Tomcat',
        link: '/monitor/opentelemetry-tomcat.html',
      },
    ],
  },

  {
    text: 'OpenTelemetry',
    children: [
      {
        text: 'Architecture',
        link: 'https://uptrace.dev/opentelemetry/architecture.html',
      },
      {
        text: 'Distributed tracing',
        link: 'https://uptrace.dev/opentelemetry/distributed-tracing.html',
      },
      {
        text: 'Metrics',
        link: 'https://uptrace.dev/opentelemetry/metrics.html',
      },
      {
        text: 'Logs',
        link: 'https://uptrace.dev/opentelemetry/logs.html',
      },
      {
        text: 'Sampling',
        link: 'https://uptrace.dev/opentelemetry/sampling.html',
      },
      {
        text: 'OpenTelemetry Collector',
        link: 'https://uptrace.dev/opentelemetry/collector.html',
      },
    ],
  },
]

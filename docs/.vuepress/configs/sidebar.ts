import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        { text: 'Getting started', link: '/get-started.html' },
        { text: 'Dashboards', link: '/dashboards.html' },
        { text: 'Alerting and notifications', link: '/alerting.html' },
        { text: 'Chart annotations', link: '/annotations.html' },
        { text: 'Service graph', link: '/service-graph.html' },
        { text: 'Monitoring logs', link: '/logging.html' },
        { text: 'Recording exceptions', link: '/exceptions.html' },
        { text: 'Grafana integration', link: '/grafana.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Uptrace Community Edition',
      children: [
        { text: 'Introduction', link: '/open-source-apm.html' },
        { text: 'Installation', link: '/install.html' },
        { text: 'Configuration', link: '/config.html' },
        { text: 'Debugging', link: '/debugging.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Querying',
      children: [
        { text: 'Querying Spans', link: '/querying-spans.html' },
        { text: 'Querying Metrics', link: '/querying-metrics.html' },
        { text: 'Grouping spans and events', link: '/grouping.html' },
        { text: 'PromQL compatibility', link: '/promql-compat.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Data Ingestion',
      children: [
        { text: 'OpenTelemetry SDK', link: '/ingest/opentelemetry.html' },
        { text: 'OpenTelemetry Collector', link: '/ingest/collector.html' },
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
      isGroup: true,
      text: 'OpenTelemetry Distros',
      children: [
        { text: 'Go', link: '/opentelemetry-go.html' },
        { text: 'Python', link: '/opentelemetry-python.html' },
        { text: 'Ruby', link: '/opentelemetry-ruby.html' },
        { text: 'Node.js', link: '/opentelemetry-js-node.html' },
        { text: 'JavaScript for Web/Browsers', link: '/opentelemetry-js-web.html' },
        { text: '.NET', link: '/opentelemetry-dotnet.html' },
        { text: 'Java', link: '/opentelemetry-java.html' },
        { text: 'Erlang and Elixir', link: '/opentelemetry-erlang-elixir.html' },
        { text: 'PHP', link: '/opentelemetry-php.html' },
        { text: 'Rust', link: '/opentelemetry-rust.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Single Sign-On',
      children: [
        { text: 'Okta', link: '/sso/okta.html' },
        { text: 'Google', link: '/sso/google.html' },
        { text: 'Keycloak', link: '/sso/keycloak.html' },
        { text: 'Cloudflare', link: '/sso/cloudflare.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Uptrace Enterprise Edition',
      children: [
        { text: 'What is Uptrace EE?', link: '/enterprise.html' },
        { text: 'Uptrace On-Premise', link: '/on-premise.html' },
        { text: 'Grouping rules', link: '/grouping-rules.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Advanced',
      children: [
        { text: 'JSON API', link: '/json-api.html' },
        { text: 'Contributing', link: '/contributing.html' },
        { text: 'Converting spans to metrics', link: '/span-metrics.html' },
        { text: 'OpenTelemetry APM', link: '/opentelemetry-apm.html' },
      ],
    },
  ],

  '/instrument/': [
    {
      isGroup: true,
      text: 'Go',
      children: [
        { text: 'net/http', link: '/instrument/opentelemetry-net-http.html' },
        { text: 'gRPC', link: '/instrument/opentelemetry-go-grpc.html' },
        { text: 'Gin', link: '/instrument/opentelemetry-gin.html' },
        { text: 'Beego', link: '/instrument/opentelemetry-beego.html' },
        { text: 'Gorilla Mux', link: '/instrument/opentelemetry-gorilla-mux.html' },
        { text: 'Labstack Echo', link: '/instrument/opentelemetry-echo.html' },
        { text: 'Go Zero', link: '/instrument/opentelemetry-go-zero.html' },
        { text: 'GORM', link: '/instrument/opentelemetry-gorm.html' },
        { text: 'Ent Go', link: '/instrument/opentelemetry-ent.html' },
        { text: 'database/sql', link: '/instrument/opentelemetry-database-sql.html' },
        { text: 'Zap', link: '/instrument/opentelemetry-zap.html' },
        { text: 'Logrus', link: '/instrument/opentelemetry-logrus.html' },
        { text: 'AWS Lambda Go', link: '/instrument/opentelemetry-go-lambda.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Python',
      children: [
        { text: 'Django', link: '/instrument/opentelemetry-django.html' },
        { text: 'Flask', link: '/instrument/opentelemetry-flask.html' },
        { text: 'FastAPI', link: '/instrument/opentelemetry-fastapi.html' },
        { text: 'Pyramid', link: '/instrument/opentelemetry-pyramid.html' },
        { text: 'SQLAlchemy', link: '/instrument/opentelemetry-sqlalchemy.html' },
        { text: 'Falcon', link: '/instrument/opentelemetry-falcon.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Ruby',
      children: [
        { text: 'Ruby On Rails', link: '/instrument/opentelemetry-rails.html' },
        { text: 'Sinatra', link: '/instrument/opentelemetry-sinatra.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Node.js',
      children: [{ text: 'Express.js', link: '/instrument/opentelemetry-express.html' }],
    },
    {
      isGroup: true,
      text: 'Elixir',
      children: [{ text: 'Phoenix Framework', link: '/instrument/opentelemetry-phoenix.html' }],
    },
    {
      isGroup: true,
      text: 'Java',
      children: [{ text: 'Spring Boot', link: '/instrument/opentelemetry-spring-boot.html' }],
    },
  ],
}

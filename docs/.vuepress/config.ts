import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { path } from '@vuepress/utils'
import { viteBundler } from '@vuepress/bundler-vite'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { searchPlugin } from '@vuepress/plugin-search'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { seoPlugin } from '@vuepress/plugin-seo'
import { redirectPlugin } from '@vuepress/plugin-redirect'
//import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { shikiPlugin } from '@vuepress/plugin-shiki'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/get/',
  lang: 'en-US',
  title: 'Uptrace',
  description: 'Distributed tracing and Metrics powered by OpenTelemetry and ClickHouse',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/get/favicon-light/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/get/favicon-light/favicon-32x32.png',
      },
    ],
  ],

  theme: defaultTheme({
    logo: '/uptrace/logo-small.svg',
    colorMode: 'light',
    colorModeSwitch: false,
    contributors: false,

    navbar: navbar.en,
    sidebar: sidebar.en,

    themePlugins: {
      prismjs: false,
    },
  }),
  alias: {
    '@': path.resolve(__dirname),
    '@public': path.resolve(__dirname, 'public'),
  },

  evergreen: !isProd,
  shouldPreload: false,
  shouldPrefetch: false,

  bundler: viteBundler({
    viteOptions: {
      plugins: [
        AutoImport({
          resolvers: [ElementPlusResolver(), IconsResolver()],
          vueTemplate: true,
        }),

        Components({
          resolvers: [
            IconsResolver({
              enabledCollections: ['ep'],
            }),
            ElementPlusResolver(),
          ],
        }),

        Icons(),
      ],
      ssr: {
        noExternal: ['element-plus'],
      },
    },
  }),

  plugins: [
    googleAnalyticsPlugin({ id: 'G-L3S07HK0E4' }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    searchPlugin({ hotKeys: [] }),
    sitemapPlugin({ hostname: 'https://uptrace.dev', changefreq: 'weekly' }),
    seoPlugin({
      hostname: 'https://uptrace.dev',
      canonical(page) {
        return 'https://uptrace.dev/get' + page.path
      },
      customHead(head, page) {
        const keywords = page.frontmatter.keywords
        if (keywords) {
          head.push([
            'meta',
            {
              name: 'keywords',
              content: keywords.join(','),
            },
          ])
        }
      },
    }),
    // mdEnhancePlugin({
    //   footnote: true,
    //   mermaid: true,
    // }),
    redirectPlugin({
      hostname: 'https://uptrace.dev',
      config: {
        '/index.html': '/open-source-apm.html',
        '/ingest/index.html': '/ingest/otlp.html',
        '/opentelemetry-metrics-grafana.html': '/install.html',
        '/opentelemetry-tracing-tool.html': '/install.html',
        '/uptrace-opentelemetry.html': '/open-source-apm.html',
        '/opentelemetry-django.html': '/opentelemetry-django-orm.html',
        '/opentelemetry-rails.html': '/opentelemetry-rails-active-record.html',
        '/uptrace-dotnet.html': '/opentelemetry-dotnet.html',
        '/uptrace-go.html': '/opentelemetry-go.html',
        '/uptrace-java.html': '/opentelemetry-java.html',
        '/uptrace-js-browser.html': '/opentelemetry-js-web.html',
        '/uptrace-js-node.html': '/opentelemetry-js-node.html',
        '/opentelemetry-js-browser.html': '/opentelemetry-js-web.html',
        '/uptrace-php.html': '/opentelemetry-php.html',
        '/uptrace-python.html': '/opentelemetry-python.html',
        '/uptrace-ruby.html': '/opentelemetry-ruby.html',

        '/compare/distributed-tracing-tools.html': 'https://uptrace.dev/blog/distributed-tracing-tools.html',
        '/compare/datadog-competitors.html': 'https://uptrace.dev/blog/datadog-competitors.html',
        '/compare/grafana-alternatives.html': 'https://uptrace.dev/blog/grafana-alternatives.html',
        '/compare/datadog-vs-prometheus.html': 'https://uptrace.dev/blog/datadog-vs-prometheus.html',

        '/opentelemetry-kubernetes.html': '/monitor/opentelemetry-kubernetes.html',
        '/opentelemetry-docker.html': '/monitor/opentelemetry-docker.html',
        '/opentelemetry-redis.html': '/monitor/opentelemetry-redis.html',
        '/opentelemetry-postgresql.html': '/monitor/opentelemetry-postgresql.html',
        '/opentelemetry-mysql.html': '/monitor/opentelemetry-mysql.html',

        '/opentelemetry-gin-gorm.html': 'https://uptrace.dev/blog/opentelemetry-gin-gorm.html',
        '/opentelemetry-django-orm.html': 'https://uptrace.dev/blog/opentelemetry-django-orm.html',
        '/opentelemetry-flask-sqlalchemy.html': 'https://uptrace.dev/blog/opentelemetry-flask-sqlalchemy.html',
        '/opentelemetry-rails-active-record.html': 'https://uptrace.dev/blog/opentelemetry-rails-active-record.html',
        '/opentelemetry-metrics-cache-stats.html': 'https://uptrace.dev/blog/opentelemetry-metrics-cache-stats.html',
        '/ingest/jaeger-opentelemetry.html': '/ingest/jaeger.html',
        '/clickhouse.html': '/monitor/opentelemetry-clickhouse.html',

        '/auth-google.html': '/sso/google.html',
        '/auth-keycloak.html': '/sso/keycloak.html',
        '/auth-cloudflare.html': '/sso/cloudflare.html',
      },
    }),
    shikiPlugin({
      langs: ['shell', 'go', 'python', 'ruby', 'php', 'js', 'ts', 'ts', 'java', 'rs', 'cs', 'erlang', 'elixir', 'yaml', 'toml', 'xml', 'diff'],
      theme: 'dark-plus',
    }),
    require('./uptrace-plugin'),
  ],
})

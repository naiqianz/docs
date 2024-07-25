<template>
  <Layout>
    <template #navbar>
      <Navbar />
    </template>
    <template #page-bottom>
      <div class="theme-default-content d-flex justify-space-between" style="padding-top: 40px; padding-bottom: 0">
        <div>
          <a href="https://uptrace.dev/" target="_blank" title="Distributed tracing and metrics">
            <img :src="$withBase('/uptrace/logo-text.svg')" style="width: 200px" />
          </a>
        </div>
        <div>
          <ClientOnly>
            <Newsletter />
          </ClientOnly>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script lang="ts">
import Layout from '@vuepress/theme-default/layouts/Layout.vue'

import Navbar from '@/components/Navbar.vue'
import Newsletter from '@/components/Newsletter.vue'

export default {
  components: {
    Layout,
    Navbar,
    Newsletter,
  },
}
</script>

<style lang="scss" scoped></style>

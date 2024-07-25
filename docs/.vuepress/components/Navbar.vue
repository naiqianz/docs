<template>
  <header class="vp-navbar">
    <div class="navbar__items">
      <a href="https://uptrace.dev/" title="Distributed tracing and metrics"><img :src="$withBase('/uptrace/logo-large.svg')" class="d-block" style="width: 140px" /></a>

      <div class="spacer"></div>

      <div style="font-size: 0.9rem">
        <VPNavbarItems class="vp-hide-mobile" />
      </div>

      <div class="spacer"></div>

      <VPSearch />

      <div style="margin-left: 15px">
        <github-button href="https://github.com/uptrace/uptrace" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star buttons/github-buttons on GitHub">Star</github-button>
      </div>

      <div style="margin-left: 15px">
        <a href="/get/get-started.html" class="btn btn--bold text-no-wrap">Get started</a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import VPNavbarItems from '@vuepress/theme-default/components/VPNavbarItems.vue'
import GithubButton from 'vue-github-button'
</script>

<style lang="scss">
:root {
  --navbar-padding-v: 0;
}
</style>

<style lang="scss" scoped>
.navbar__items {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  padding: 12px;
  border-radius: 4px;

  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}

.btn--bold {
  color: #fff;
  background-color: #d84315;

  &:hover {
    background-color: #e64a19;
  }
}
</style>

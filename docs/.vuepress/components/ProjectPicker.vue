<template>
  <el-dropdown v-if="projects.length" trigger="click">
    <el-button type="primary">
      <span>{{ modelValue ? `Project: ${modelValue.name}` : 'Select a project' }}</span>
      <el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="project in projects"
          :key="project.id"
          @click="$emit('update:modelValue', project)"
          >{{ project.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Project } from '@/use/org.ts'

export default defineComponent({
  name: 'ProjectPicker',

  props: {
    modelValue: {
      type: Object as PropType<Project>,
      default: undefined,
    },
    projects: {
      type: Array as PropType<Project[]>,
      required: true,
    },
  },
})
</script>

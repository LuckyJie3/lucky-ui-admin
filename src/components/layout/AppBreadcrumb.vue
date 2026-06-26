<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, idx) in breadcrumbs" :key="idx" :to="idx < breadcrumbs.length - 1 ? item.path : undefined">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { asyncRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

function matchTitle(target: string, routes: RouteRecordRaw[], prefix = ''): string | null {
  for (const r of routes) {
    const self = (prefix + '/' + r.path).replace(/\/\/+/g, '/')
    if (self === target) return r.meta?.title as string || null
    if (r.children) {
      const found = matchTitle(target, r.children, self)
      if (found) return found
    }
  }
  return null
}

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const items: { title: string; path: string }[] = []
  let cur = ''
  for (const seg of segments) {
    cur += '/' + seg
    const key = matchTitle(cur, asyncRoutes)
    items.push({ title: key ? t(key) : seg, path: cur })
  }
  return items
})
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  font-size: 13px;
  :deep(.el-breadcrumb__inner) {
    color: var(--text-secondary); font-weight: 400;
    &:hover { color: var(--color-primary); }
  }
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: var(--text-primary); font-weight: 500;
  }
}
</style>

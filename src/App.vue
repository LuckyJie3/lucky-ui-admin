<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useLocale } from '@/composables/useLocale'

const { elLocale } = useLocale()
</script>

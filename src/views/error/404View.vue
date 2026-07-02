<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">404</div>
      <h1 class="error-title">{{ t('error404.title') }}</h1>
      <p class="error-desc">{{ t('error404.description') }}</p>
      <el-button type="primary" :icon="HomeFilled" @click="$router.push('/dashboard')">
        {{ t('error404.backHome') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { HomeFilled } from '@element-plus/icons-vue'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.error-page {
  display: grid;
  min-height: 100%;
  place-items: center;
  padding: 24px;
}

.error-card {
  text-align: center;
  padding: 48px 32px;
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.error-code {
  font-size: 80px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 12px;
  opacity: 0.7;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.error-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}
</style>

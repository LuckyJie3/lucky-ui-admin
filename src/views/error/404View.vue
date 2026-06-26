<template>
  <div class="error-page">
    <div class="error-content glass-panel">
      <div class="error-code">404</div>
      <h1 class="error-title">{{ t('error404.title') }}</h1>
      <p class="error-desc">{{ t('error404.description') }}</p>
      <el-button type="primary" size="large" :icon="HomeFilled" @click="$router.push('/dashboard')">
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

.error-content {
  width: min(520px, 100%);
  padding: 42px 28px;
  text-align: center;
}

.error-code {
  margin-bottom: 10px;
  color: var(--color-primary);
  font-size: clamp(80px, 18vw, 128px);
  font-weight: 840;
  letter-spacing: 0;
  line-height: 0.9;
}

.error-title {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 760;
}

.error-desc {
  margin-bottom: 28px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>

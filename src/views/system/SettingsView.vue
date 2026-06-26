<template>
  <div class="page-shell settings-page">
    <section class="page-hero">
      <div>
        <p class="page-hero__eyebrow">System</p>
        <h1 class="page-hero__title">{{ t('settings.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <el-button :icon="RefreshLeft" @click="resetPreferences">{{ t('settings.resetSettings') }}</el-button>
    </section>

    <section class="settings-grid">
      <GlassCard :title="t('settings.theme')" :description="t('settings.themeTips')">
        <div class="theme-options">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            class="theme-option"
            :class="{ active: appStore.themeMode === option.value }"
            type="button"
            @click="setTheme(option.value)"
          >
            <span class="theme-preview" :class="`theme-preview--${option.value}`" />
            {{ t(option.label) }}
          </button>
        </div>

        <div class="color-row">
          <span>{{ t('settings.primaryColor') }}</span>
          <button
            v-for="color in colors"
            :key="color"
            class="color-dot"
            :class="{ active: appStore.primaryColor === color }"
            :style="{ backgroundColor: color }"
            type="button"
            @click="appStore.setPrimaryColor(color)"
          />
        </div>
      </GlassCard>

      <GlassCard :title="t('settings.language')" :description="t('settings.langTips')">
        <el-radio-group :model-value="locale" @change="(value) => setLocale(value as Locale)">
          <el-radio-button value="zh-CN">中文</el-radio-button>
          <el-radio-button value="en-US">English</el-radio-button>
        </el-radio-group>
      </GlassCard>

      <GlassCard :title="t('settings.layout')" :description="t('settings.layoutTips')">
        <div class="layout-list">
          <label>
            <span>{{ t('settings.showBreadcrumb') }}</span>
            <el-switch :model-value="appStore.showBreadcrumb" @change="(value) => appStore.setShowBreadcrumb(Boolean(value))" />
          </label>
          <label>
            <span>{{ t('settings.showFooter') }}</span>
            <el-switch :model-value="appStore.showFooter" @change="(value) => appStore.setShowFooter(Boolean(value))" />
          </label>
          <label>
            <span>{{ t('settings.compactMode') }}</span>
            <el-switch :model-value="appStore.compactMode" @change="(value) => appStore.setCompactMode(Boolean(value))" />
          </label>
        </div>
      </GlassCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { RefreshLeft } from '@element-plus/icons-vue'
import GlassCard from '@/components/common/GlassCard.vue'
import { useAppStore } from '@/stores/app'
import { useLocale, type Locale } from '@/composables/useLocale'
import { useTheme, type ThemeMode } from '@/composables/useTheme'

const { t } = useI18n()
const appStore = useAppStore()
const { locale, setLocale } = useLocale()
const { setTheme } = useTheme()

const themeOptions: Array<{ label: string; value: ThemeMode }> = [
  { label: 'settings.lightMode', value: 'light' },
  { label: 'settings.darkMode', value: 'dark' },
  { label: 'settings.autoMode', value: 'auto' },
]

const colors = ['#0f8f8c', '#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed']

function resetPreferences() {
  appStore.resetPreferences()
  ElMessage.success(t('common.success'))
}
</script>

<style lang="scss" scoped>
.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 14px;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.theme-option {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;

  &.active {
    color: var(--color-primary);
    border-color: rgba(var(--color-primary-rgb), 0.5);
    box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.1);
  }
}

.theme-preview {
  height: 68px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);

  &--light {
    background: linear-gradient(90deg, #ffffff 28%, #edf4f1 28%);
  }

  &--dark {
    background: linear-gradient(90deg, #07100f 28%, #142221 28%);
  }

  &--auto {
    background: linear-gradient(135deg, #ffffff 0 50%, #07100f 50% 100%);
  }
}

.color-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  color: var(--text-secondary);
}

.color-dot {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  cursor: pointer;

  &.active {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
  }
}

.layout-list {
  display: grid;
  gap: 16px;

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--text-secondary);
  }
}

@media (max-width: 980px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>

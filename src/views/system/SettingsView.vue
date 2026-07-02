<template>
  <div class="page-shell settings-page">
    <section class="page-hero">
      <div>
        <p class="page-hero__eyebrow">System</p>
        <h1 class="page-hero__title">{{ t('settings.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <el-button size="small" :icon="RefreshLeft" @click="resetPreferences">{{ t('settings.resetSettings') }}</el-button>
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
            <span class="theme-label">{{ t(option.label) }}</span>
          </button>
        </div>

        <div class="color-section">
          <p class="color-label">{{ t('settings.primaryColor') }}</p>
          <div class="color-row">
            <button
              v-for="color in colors"
              :key="color"
              class="color-swatch"
              :class="{ active: appStore.primaryColor === color }"
              :style="{ '--sw-color': color }"
              type="button"
              @click="appStore.setPrimaryColor(color)"
            >
              <el-icon v-if="appStore.primaryColor === color" :size="12" color="#fff"><Check /></el-icon>
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard :title="t('settings.language')" :description="t('settings.langTips')">
        <el-radio-group :model-value="locale" @change="(value) => setLocale(value as Locale)">
          <el-radio-button value="zh-CN">中文</el-radio-button>
          <el-radio-button value="en-US">English</el-radio-button>
        </el-radio-group>
      </GlassCard>

      <GlassCard :title="t('settings.layout')" :description="t('settings.layoutTips')">
        <div class="switch-list">
          <label class="switch-item">
            <span>{{ t('settings.showBreadcrumb') }}</span>
            <el-switch :model-value="appStore.showBreadcrumb" @change="(v) => appStore.setShowBreadcrumb(Boolean(v))" />
          </label>
          <label class="switch-item">
            <span>{{ t('settings.showFooter') }}</span>
            <el-switch :model-value="appStore.showFooter" @change="(v) => appStore.setShowFooter(Boolean(v))" />
          </label>
          <label class="switch-item">
            <span>{{ t('settings.compactMode') }}</span>
            <el-switch :model-value="appStore.compactMode" @change="(v) => appStore.setCompactMode(Boolean(v))" />
          </label>
        </div>
      </GlassCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Check, RefreshLeft } from '@element-plus/icons-vue'
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

const colors = ['#0066ff', '#7c3aed', '#16a34a', '#d97706', '#dc2626', '#0f8f8c']

function resetPreferences() {
  appStore.resetPreferences()
  ElMessage.success(t('common.success'))
}
</script>

<style lang="scss" scoped>
.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 16px;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &.active {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }
}

.theme-preview {
  height: 52px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);

  &--light { background: linear-gradient(90deg, #fff 30%, #f0f2f5 30%); }
  &--dark  { background: linear-gradient(90deg, #141414 30%, #1a1a1a 30%); }
  &--auto  { background: linear-gradient(135deg, #fff 0 50%, #141414 50%); }
}

.theme-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.color-section {
  margin-top: 16px;
}

.color-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.color-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--sw-color);
  cursor: pointer;
  transition: all var(--transition-fast);

  &.active {
    border-color: var(--sw-color);
    box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--sw-color);
  }
}

.switch-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .settings-grid { grid-template-columns: 1fr; }
}
</style>

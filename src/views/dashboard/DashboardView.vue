<template>
  <div class="dashboard-page" style="padding: 16px;">
    <section class="page-hero">
      <div class="hero-info">
        <p class="page-hero__eyebrow">Dashboard</p>
        <h1 class="page-hero__title">{{ t('dashboard.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="hero-badge">
        <span class="badge-label">{{ t('dashboard.target') }}</span>
        <strong class="badge-value">92%</strong>
      </div>
    </section>

    <el-row :gutter="20" class="stats-grid">
      <el-col v-for="item in stats" :key="item.key" :span="6" :xs="12">
        <el-card shadow="never" class="rounded-md stat-card" :body-style="{ padding: '16px 20px' }">
          <div class="stat-card__inner">
            <div>
              <div class="stat-card__label">{{ t(item.label) }}</div>
              <div class="stat-card__value">{{ item.value }}</div>
              <div class="stat-card__trend" :class="item.trend >= 0 ? 'is-up' : 'is-down'">
                {{ item.trend > 0 ? '&#8593;' : '&#8595;' }} {{ Math.abs(item.trend) }}%
                <span class="trend-desc">{{ t('dashboard.vsLastMonth') }}</span>
              </div>
            </div>
            <div class="stat-card__icon" :style="{ background: item.iconBg }">
              <el-icon :size="22" :style="{ color: item.iconColor }"><component :is="item.icon" /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="14" :xs="24">
        <el-card shadow="never" class="rounded-md" :body-style="{ padding: '20px' }">
          <template #header><span class="font-bold">{{ t('dashboard.salesOverview') }}</span></template>
          <div class="chart">
            <div v-for="bar in bars" :key="bar.month" class="chart__col">
              <span class="chart__bar" :style="{ height: `${bar.value}%` }" />
              <small>{{ bar.month }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :xs="24">
        <el-card shadow="never" class="rounded-md" :body-style="{ padding: '20px' }">
          <template #header><span class="font-bold">{{ t('dashboard.channelHealth') }}</span></template>
          <div class="health-list">
            <div v-for="item in health" :key="item.label" class="health-item">
              <div class="health-item__head">
                <span>{{ t(item.label) }}</span>
                <strong>{{ item.value }}%</strong>
              </div>
              <el-progress :percentage="item.value" :stroke-width="6" :show-text="false" color="var(--el-color-primary)" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="rounded-md" :body-style="{ padding: '20px' }">
      <template #header><span class="font-bold">{{ t('dashboard.recentActivity') }}</span></template>
      <div class="activity-list">
        <article v-for="item in activities" :key="item.id" class="activity-item">
          <span class="activity-dot" />
          <div class="activity-content">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
          <time>{{ item.time }}</time>
        </article>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Coin, Files, TrendCharts, UserFilled } from '@element-plus/icons-vue'

const { t } = useI18n()

const stats = [
  { key: 'users', label: 'dashboard.totalUsers', value: '128,460', trend: 12.8, icon: UserFilled, iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
  { key: 'active', label: 'dashboard.activeUsers', value: '38,212', trend: 8.4, icon: TrendCharts, iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
  { key: 'revenue', label: 'dashboard.revenue', value: '$928k', trend: 6.1, icon: Coin, iconColor: '#9270ca', iconBg: 'rgba(146, 112, 202, 0.12)' },
  { key: 'orders', label: 'dashboard.orders', value: '51,328', trend: -2.3, icon: Files, iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
]

const bars = [
  { month: 'Jan', value: 38 }, { month: 'Feb', value: 54 }, { month: 'Mar', value: 46 },
  { month: 'Apr', value: 68 }, { month: 'May', value: 59 }, { month: 'Jun', value: 84 },
  { month: 'Jul', value: 71 }, { month: 'Aug', value: 76 }, { month: 'Sep', value: 92 },
  { month: 'Oct', value: 81 }, { month: 'Nov', value: 88 }, { month: 'Dec', value: 96 },
]

const health = [
  { label: 'dashboard.conversion', value: 76 },
  { label: 'dashboard.fulfillment', value: 93 },
  { label: 'dashboard.satisfaction', value: 88 },
]

const activities = [
  { id: 1, title: 'Aster Studio upgraded to Pro', desc: 'Owner changed from trial to annual subscription.', time: '09:42' },
  { id: 2, title: 'Order batch approved', desc: 'Finance released 248 pending fulfillment items.', time: '10:16' },
  { id: 3, title: 'Campaign audience refreshed', desc: 'Segment rules matched 18,420 active customers.', time: '11:03' },
]
</script>

<style lang="scss" scoped>
.stats-grid {
  margin-bottom: 20px;
}

.stat-card__inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: 88px;
}

.stat-card__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.stat-card__value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--el-text-color-primary);
  letter-spacing: -0.02em;
}

.stat-card__trend {
  margin-top: 10px;
  font-size: 12px;

  &.is-up { color: var(--el-color-success); }
  &.is-down { color: var(--el-color-danger); }

  .trend-desc {
    color: var(--el-text-color-secondary);
    font-weight: 400;
    margin-left: 4px;
  }
}

.stat-card__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 220px;
  gap: 8px;
}

.chart__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 6px;

  small { font-size: 11px; color: var(--el-text-color-secondary); }
}

.chart__bar {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  background: var(--el-color-primary);
  opacity: 0.8;
  transition: opacity 0.15s ease;

  &:hover { opacity: 1; }
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.health-item__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  strong { font-weight: 600; color: var(--el-text-color-primary); }
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
}

.activity-content {
  flex: 1;
  min-width: 0;

  strong {
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  p {
    margin-top: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.activity-dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
  flex-shrink: 0;
}

time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}
</style>

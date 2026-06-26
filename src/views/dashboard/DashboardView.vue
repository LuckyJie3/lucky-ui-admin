<template>
  <div class="page-shell dashboard-page">
    <section class="page-hero">
      <div>
        <p class="page-hero__eyebrow">Lucky Admin</p>
        <h1 class="page-hero__title">{{ t('dashboard.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="hero-orbit">
        <span>{{ t('dashboard.target') }}</span>
        <strong>92%</strong>
      </div>
    </section>

    <section class="stats-grid">
      <GlassCard v-for="item in stats" :key="item.key" variant="strong">
        <div class="stat-card">
          <span class="stat-icon" :style="{ color: item.color, backgroundColor: item.tint }">
            <el-icon><component :is="item.icon" /></el-icon>
          </span>
          <div>
            <p class="stat-label">{{ t(item.label) }}</p>
            <strong class="stat-value">{{ item.value }}</strong>
            <span class="stat-trend" :class="{ down: item.trend < 0 }">
              {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}% {{ t('dashboard.vsLastMonth') }}
            </span>
          </div>
        </div>
      </GlassCard>
    </section>

    <section class="dashboard-grid">
      <GlassCard :title="t('dashboard.salesOverview')" class="chart-card">
        <div class="chart">
          <div v-for="bar in bars" :key="bar.month" class="chart__item">
            <span class="chart__bar" :style="{ height: `${bar.value}%` }" />
            <small>{{ bar.month }}</small>
          </div>
        </div>
      </GlassCard>

      <GlassCard :title="t('dashboard.channelHealth')">
        <div class="health-list">
          <div v-for="item in health" :key="item.label" class="health-item">
            <div>
              <strong>{{ t(item.label) }}</strong>
              <span>{{ item.value }}%</span>
            </div>
            <el-progress :percentage="item.value" :stroke-width="9" :show-text="false" />
          </div>
        </div>
      </GlassCard>
    </section>

    <GlassCard :title="t('dashboard.recentActivity')">
      <div class="activity-grid">
        <article v-for="item in activities" :key="item.id" class="activity-item">
          <span class="activity-dot" />
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
          <time>{{ item.time }}</time>
        </article>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Coin, Files, TrendCharts, UserFilled } from '@element-plus/icons-vue'
import GlassCard from '@/components/common/GlassCard.vue'

const { t } = useI18n()

const stats = [
  { key: 'users', label: 'dashboard.totalUsers', value: '128,460', trend: 12.8, icon: UserFilled, color: '#0f8f8c', tint: 'rgba(15, 143, 140, 0.14)' },
  { key: 'active', label: 'dashboard.activeUsers', value: '38,212', trend: 8.4, icon: TrendCharts, color: '#4f46e5', tint: 'rgba(79, 70, 229, 0.13)' },
  { key: 'revenue', label: 'dashboard.revenue', value: '$928k', trend: 6.1, icon: Coin, color: '#d97706', tint: 'rgba(217, 119, 6, 0.14)' },
  { key: 'orders', label: 'dashboard.orders', value: '51,328', trend: -2.3, icon: Files, color: '#dc2626', tint: 'rgba(220, 38, 38, 0.13)' },
]

const bars = [
  { month: 'Jan', value: 38 },
  { month: 'Feb', value: 54 },
  { month: 'Mar', value: 46 },
  { month: 'Apr', value: 68 },
  { month: 'May', value: 59 },
  { month: 'Jun', value: 84 },
  { month: 'Jul', value: 71 },
  { month: 'Aug', value: 76 },
  { month: 'Sep', value: 92 },
  { month: 'Oct', value: 81 },
  { month: 'Nov', value: 88 },
  { month: 'Dec', value: 96 },
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
@use '@/assets/styles/mixins' as *;

.hero-orbit {
  display: grid;
  width: 116px;
  height: 116px;
  flex: 0 0 116px;
  place-items: center;
  border-radius: 50%;
  color: var(--text-primary);
  background:
    linear-gradient(var(--bg-primary), var(--bg-primary)) padding-box,
    conic-gradient(from 110deg, var(--color-primary), transparent 74%, var(--color-primary)) border-box;
  border: 1px solid transparent;

  span {
    align-self: end;
    color: var(--text-muted);
    font-size: 12px;
  }

  strong {
    align-self: start;
    font-size: 30px;
    line-height: 1;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.stat-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: var(--radius-md);
  font-size: 20px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.stat-value {
  display: block;
  margin-top: 4px;
  color: var(--text-primary);
  font-size: 26px;
  line-height: 1;
}

.stat-trend {
  display: inline-block;
  margin-top: 10px;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 700;

  &.down {
    color: var(--color-danger);
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.55fr);
  gap: 14px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(12, minmax(18px, 1fr));
  align-items: end;
  height: 260px;
  gap: 10px;
}

.chart__item {
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;
  gap: 8px;
  align-items: end;
  color: var(--text-muted);
  font-size: 11px;
  text-align: center;
}

.chart__bar {
  width: 100%;
  min-height: 12px;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(180deg, rgba(var(--color-primary-rgb), 0.86), rgba(var(--color-primary-rgb), 0.2));
}

.health-list {
  display: grid;
  gap: 20px;
}

.health-item {
  display: grid;
  gap: 10px;

  div {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary);
    font-size: 13px;
  }
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.activity-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.18);

  strong,
  p {
    @include text-ellipsis;
  }

  p,
  time {
    color: var(--text-muted);
    font-size: 12px;
  }
}

.activity-dot {
  width: 9px;
  height: 9px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 5px rgba(var(--color-primary-rgb), 0.12);
}

@media (max-width: 1180px) {
  .stats-grid,
  .activity-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .stats-grid,
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>

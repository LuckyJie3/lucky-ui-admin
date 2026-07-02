<template>
  <div class="page-shell dashboard-page">
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

    <section class="stats-grid">
      <div v-for="item in stats" :key="item.key" class="stat-card">
        <div class="stat-card__header">
          <span class="stat-card__label">{{ t(item.label) }}</span>
          <span class="stat-card__icon" :style="{ color: item.color, background: item.tint }">
            <el-icon :size="16"><component :is="item.icon" /></el-icon>
          </span>
        </div>
        <div class="stat-card__value">{{ item.value }}</div>
        <div class="stat-card__trend" :class="{ down: item.trend < 0 }">
          <span>{{ item.trend > 0 ? '&#8593;' : '&#8595;' }} {{ Math.abs(item.trend) }}%</span>
          <span class="trend-desc">{{ t('dashboard.vsLastMonth') }}</span>
        </div>
      </div>
    </section>

    <section class="dashboard-grid">
      <GlassCard :title="t('dashboard.salesOverview')">
        <div class="chart">
          <div v-for="bar in bars" :key="bar.month" class="chart__col">
            <span class="chart__bar" :style="{ height: `${bar.value}%` }" />
            <small>{{ bar.month }}</small>
          </div>
        </div>
      </GlassCard>

      <GlassCard :title="t('dashboard.channelHealth')">
        <div class="health-list">
          <div v-for="item in health" :key="item.label" class="health-item">
            <div class="health-item__head">
              <span>{{ t(item.label) }}</span>
              <strong>{{ item.value }}%</strong>
            </div>
            <el-progress :percentage="item.value" :stroke-width="6" :show-text="false" :color="'var(--color-primary)'" />
          </div>
        </div>
      </GlassCard>
    </section>

    <GlassCard :title="t('dashboard.recentActivity')">
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
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Coin, Files, TrendCharts, UserFilled } from '@element-plus/icons-vue'
import GlassCard from '@/components/common/GlassCard.vue'

const { t } = useI18n()

const stats = [
  { key: 'users', label: 'dashboard.totalUsers', value: '128,460', trend: 12.8, icon: UserFilled, color: 'hsl(212, 100%, 45%)', tint: 'hsl(212, 100%, 96%)' },
  { key: 'active', label: 'dashboard.activeUsers', value: '38,212', trend: 8.4, icon: TrendCharts, color: 'hsl(144, 57%, 58%)', tint: 'hsl(144, 57%, 96%)' },
  { key: 'revenue', label: 'dashboard.revenue', value: '$928k', trend: 6.1, icon: Coin, color: 'hsl(42, 84%, 61%)', tint: 'hsl(42, 84%, 96%)' },
  { key: 'orders', label: 'dashboard.orders', value: '51,328', trend: -2.3, icon: Files, color: 'hsl(348, 100%, 61%)', tint: 'hsl(348, 100%, 97%)' },
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
.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  flex-shrink: 0;
}

.badge-label {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1;
}

.badge-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  padding: 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-card__label {
  font-size: 13px;
  color: var(--text-muted);
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
}

.stat-card__value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-success);

  &.down {
    color: var(--color-danger);
  }

  .trend-desc {
    color: var(--text-muted);
    font-weight: 400;
  }
}

/* ── Chart grid ── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 220px;
  gap: 8px;
  padding-top: 16px;
}

.chart__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 6px;

  small {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.chart__bar {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  background: var(--color-primary);
  opacity: 0.8;
  transition: opacity var(--transition-fast);

  &:hover {
    opacity: 1;
  }
}

/* ── Health ── */
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
  color: var(--text-secondary);

  strong {
    font-weight: 600;
    color: var(--text-primary);
  }
}

/* ── Activity ── */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
}

.activity-content {
  flex: 1;
  min-width: 0;

  strong {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  p {
    margin-top: 2px;
    font-size: 12px;
    color: var(--text-muted);
  }
}

.activity-dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}

time {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

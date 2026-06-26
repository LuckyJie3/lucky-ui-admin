<template>
  <section class="glass-card" :class="[`glass-card--${variant}`]">
    <header v-if="$slots.header || title" class="glass-card__header">
      <slot name="header">
        <div>
          <h3 class="glass-card__title">{{ title }}</h3>
          <p v-if="description" class="glass-card__description">{{ description }}</p>
        </div>
      </slot>
    </header>
    <div class="glass-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="glass-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    description?: string
    title?: string
    variant?: 'default' | 'flat' | 'strong'
  }>(),
  {
    variant: 'default',
  },
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.glass-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  @include glass-surface;
  @include glass-edge;

  &--flat {
    background: var(--bg-primary);
    box-shadow: var(--shadow-sm);
  }

  &--strong {
    background: linear-gradient(145deg, var(--glass-bg-strong), rgba(var(--color-primary-rgb), 0.1));
  }
}

.glass-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border-color);
}

.glass-card__title {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 760;
  line-height: 1.2;
}

.glass-card__description {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.glass-card__body {
  padding: 18px;
}

.glass-card__footer {
  padding: 14px 18px;
  border-top: 1px solid var(--border-color);
  background: rgba(var(--color-primary-rgb), 0.04);
}
</style>

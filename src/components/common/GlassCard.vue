<template>
  <section class="app-card" :class="[`app-card--${variant}`]">
    <header v-if="$slots.header || title" class="app-card__header">
      <slot name="header">
        <h3 v-if="title" class="app-card__title">{{ title }}</h3>
        <p v-if="description" class="app-card__description">{{ description }}</p>
      </slot>
    </header>
    <div class="app-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="app-card__footer">
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
.app-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);

  &--flat {
    box-shadow: none;
  }

  &--default {
    box-shadow: var(--shadow-sm);
  }

  &--strong {
    box-shadow: var(--shadow-sm);
    border-left: 3px solid var(--color-primary);
  }
}

.app-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.app-card__title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.app-card__description {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12px;
}

.app-card__body {
  padding: 16px;
}

.app-card__footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
}
</style>

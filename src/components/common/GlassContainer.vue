<template>
  <div class="glass-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.glass-container {
  padding: 20px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  @include glass-surface;
  @include glass-edge;
}
</style>

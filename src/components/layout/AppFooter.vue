<template>
  <footer class="app-footer">
    <span>Lucky Admin &copy; 2026</span>
    <span class="footer-divider">|</span>
    <span>Vue 3 + Element Plus</span>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-size: 12px;
  @include glass-surface;
}

.footer-divider {
  opacity: 0.3;
}
</style>

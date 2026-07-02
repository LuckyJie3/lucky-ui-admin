<template>
  <div class="card-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
</style>

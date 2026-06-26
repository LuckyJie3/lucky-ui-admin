<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :href="`#${name}`" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  className?: string
}>()
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<template>
  <div class="unlockable-slider border is-flex is-flex-1 slider-bar">
    <div
      v-if="value > 0"
      class="unlockable-slider-inner border slider-bar"
      :style="widthStyle"></div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: number
  }>(),
  {
    value: 0,
  },
)

const widthStyle = computed(() => ({ width: `${props.value * 100}%` }))
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-slider {
  position: relative;
  @include ktheme() {
    background: theme('background-color');
  }
  &-inner {
    position: absolute;
    left: -1px;
    top: -1px;
    background: $primary;
  }
}

.slider-bar {
  border-radius: 2.5rem;
  height: 14px;
}
</style>

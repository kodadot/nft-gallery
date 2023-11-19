<template>
  <div class="unlockable-slider border slider-bar">
    <div
      v-if="value > 0"
      class="unlockable-slider-inner border slider-bar"
      :style="style"></div>
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

const style = computed(() => ({
  width: `${props.value * 100}%`,
}))
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-slider {
  position: relative;
  height: 14px;
  overflow: hidden;
  @include ktheme() {
    background: theme('background-color');
  }
  &-inner {
    position: absolute;
    left: -1px;
    top: -1px;
    height: 100%;
    background: $primary;
    box-sizing: content-box;
  }
}

.slider-bar {
  border-radius: 2.5rem;
}
</style>

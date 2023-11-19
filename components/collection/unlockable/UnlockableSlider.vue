<template>
  <div class="unlockable-slider border slider-bar">
    <div
      v-if="value > 0"
      class="unlockable-slider-inner slider-bar"
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

const style = computed(() => {
  const progress = props.value * 100

  return {
    width: `${progress}%`,
    'border-right': progress === 100 ? 'none' : '',
  }
})
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
    height: 100%;
    background: $primary;
    border-right: inherit;
  }
}

.slider-bar {
  border-radius: 2.5rem;
}
</style>

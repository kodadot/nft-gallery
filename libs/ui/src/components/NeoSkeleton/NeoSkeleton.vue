<template>
  <o-skeleton
    :root-class="['neo-skeleton', fullSize && 'neo-skeleton-full-size']"
    :item-class="[
      'neo-skeleton-item',
      noMargin && 'no-margin',
      fullSize && 'neo-skeleton-full-size',
      light && 'neo-skeleton-item--light',
    ]"
    :style="{
      '--border-radius': borderRadius,
    }"
    :animated="animated"
    :active="active"
    :circle="circle"
    :height="height"
    :width="width"
    :count="count"
    :rounded="rounded"
    :size="size">
  </o-skeleton>
</template>

<script lang="ts" setup>
import { OSkeleton } from '@oruga-ui/oruga-next'

export interface Props {
  itemClass?: string
  animated?: boolean
  active?: boolean
  circle?: boolean
  height?: number | string
  width?: number | string
  count?: number
  rounded?: boolean
  size?: 'small' | 'medium' | 'large'
  position?: 'centered' | 'left' | 'right'
  noMargin?: boolean
  fullSize?: boolean
  borderRadius?: string
  light?: boolean
}
withDefaults(defineProps<Props>(), {
  animated: true,
  active: true,
  rounded: true,
  light: false,
})
</script>

<style lang="scss">
@import './NeoSkeleton.scss';
</style>

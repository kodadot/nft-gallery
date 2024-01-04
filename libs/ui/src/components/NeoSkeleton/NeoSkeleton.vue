<template>
  <o-skeleton
    :root-class="['neo-skeleton', fullSize && 'neo-skeleton-full-size']"
    :item-class="[
      'neo-skeleton-item',
      noMargin && 'no-margin',
      fullSize && 'neo-skeleton-full-size',
      `neo-skeleton-item--${variant}`,
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
  variant?: 'k-shade' | 'k-grey-light'
}
withDefaults(defineProps<Props>(), {
  animated: true,
  active: true,
  rounded: true,
  variant: 'k-shade',
  height: undefined,
  width: undefined,
  count: 1,
  size: undefined,
  position: 'left',
  borderRadius: undefined,
})
</script>

<style lang="scss">
@import './NeoSkeleton.scss';
</style>

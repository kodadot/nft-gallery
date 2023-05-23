<template>
  <o-skeleton
    :root-class="['neo-skeleton', fullSize && 'neo-skeleton-full-size']"
    :item-class="[
      'neo-skeleton-item',
      noMargin && 'no-margin',
      fullSize && 'neo-skeleton-full-size',
    ]"
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
import { OSkeleton } from '@oruga-ui/oruga'

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
}
withDefaults(defineProps<Props>(), {
  animated: true,
  active: true,
  rounded: true,
})
</script>

<style lang="scss">
@import './NeoSkeleton.scss';
</style>

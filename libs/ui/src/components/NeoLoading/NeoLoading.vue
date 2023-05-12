<template>
  <o-loading
    :active.sync="isLoadingActive"
    :can-cancel="canCancel"
    :overlay-class="'neo-loading-overlay'"
    :is-full-page="isFullPage">
    <slot />
  </o-loading>
</template>

<script lang="ts" setup>
import { OLoading } from '@oruga-ui/oruga'

const props = defineProps<{
  value?: boolean
  canCancel?: string[] | boolean
  isFullPage?: boolean
}>()

const isLoadingActive = useVModel(props, 'value')
</script>

<style lang="scss">
@import './NeoLoading.scss';
</style>

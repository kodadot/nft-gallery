<template>
  <OLoading v-bind="$attrs">
    <slot>
      <NeoIcon icon="spinner-third" spin size="large" class="has-text-white" />
    </slot>
  </OLoading>
</template>
<script lang="ts">
import { OLoading } from '@oruga-ui/oruga-next'
import { NeoIcon } from '../..'

export default {
  components: { NeoIcon, OLoading },
}
</script>

<style lang="scss">
@import './NeoLoading.scss';
</style>

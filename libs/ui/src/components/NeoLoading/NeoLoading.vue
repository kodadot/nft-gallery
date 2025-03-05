<template>
  <OLoading v-bind="$attrs">
    <slot>
      <Icon
        name="i-mdi:loading"
        class="animate-spin text-white text-6xl"
      />
    </slot>
  </OLoading>
</template>

<script lang="ts">
import { OLoading } from '@oruga-ui/oruga-next'

export default {
  components: { OLoading },
}
</script>

<style lang="scss">
@import './NeoLoading.scss';
</style>

<template>
  <OLoading v-bind="$attrs">
    <slot>
      <KIcon
        name="i-mdi:loading"
        size="large"
        class="text-white animate-spin"
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

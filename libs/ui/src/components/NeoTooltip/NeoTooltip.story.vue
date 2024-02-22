<template>
  <Story title="NeoTooltip" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="1">
      <div class="mt-20 flex justify-center">
        <NeoTooltip label="Tooltip top">
          <div class="border divide-solid divide-[blue] w-[30px]">Top</div>
        </NeoTooltip>
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoTooltip from './NeoTooltip.vue'
</script>
<style lang="scss">
@import '@oruga-ui/oruga-next/dist/oruga.min.css';
</style>

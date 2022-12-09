<template>
  <Story title="NeoTooltip" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="1">
      <div
        :style="{
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'center',
        }">
        <NeoTooltip label="Tooltip top">
          <div :style="{ border: '1px solid blue', width: '30px' }">Top</div>
        </NeoTooltip>
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { Container } from 'postcss'
import NeoTooltip from './NeoTooltip.vue'
</script>
<style lang="scss">
@import '@oruga-ui/oruga/dist/oruga.min.css';
</style>

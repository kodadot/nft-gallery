<template>
  <Story title="NeoCheckbox" :layout="{ type: 'grid', width: '200px' }">
    <NeoCheckbox> {{ label }} </NeoCheckbox>
  </Story>
</template>

<script lang="ts" setup>
import { NeoCheckbox } from '@kodadot1/brick'

const label = 'Sample'
</script>

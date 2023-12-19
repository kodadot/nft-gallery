<template>
  <Story title="NeoLoading" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Loading">
      <NeoLoading :active="true" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoLoading from './NeoLoading.vue'
</script>

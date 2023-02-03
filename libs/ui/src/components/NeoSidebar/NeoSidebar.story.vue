<template>
  <Story>
    <NeoSidebar
      :mobile="mobile"
      :expand-on-hover="expandOnHover"
      :reduce="reduce">
      <div>test</div>
    </NeoSidebar>
  </Story>
</template>

<script lang="ts" setup>
import NeoSidebar from './NeoSidebar.vue'

const mobile = 'reduced'
const expandOnHover = false
const reduce = false
</script>

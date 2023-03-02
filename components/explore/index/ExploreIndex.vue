<template>
  <div>
    <MobileIndex class="is-hidden-dektop" />
    <DesktopIndex class="is-hidden-touch" />
  </div>
</template>

<script setup lang="ts">
import DesktopIndex from './DesktopIndex.vue'
import MobileIndex from './MobileIndex.vue'
</script>

<template>
  <div>
    <MobileIndex class="is-hidden-tablet" />
    <DesktopIndex class="is-hidden-mobile" />
  </div>
</template>

<script setup lang="ts">
import DesktopIndex from './DesktopControls.vue'
import MobileIndex from './MobileControls.vue'
</script>

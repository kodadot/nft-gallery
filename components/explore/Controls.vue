<template>
  <div>
    <MobileControls class="is-hidden-tablet" />
    <DesktopControls class="is-hidden-mobile" />
  </div>
</template>

<script setup lang="ts">
import DesktopControls from './DesktopControls.vue'
import MobileControls from './MobileControls.vue'
</script>

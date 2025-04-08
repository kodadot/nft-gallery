<template>
  <div>
    <MobileControls class="md:hidden" />
    <DesktopControls class="hidden md:flex" />
  </div>
</template>

<script setup lang="ts">
import DesktopControls from './DesktopControls.vue'
import MobileControls from './MobileControls.vue'
</script>

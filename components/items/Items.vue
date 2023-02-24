<template>
  <div>
    <div class="is-flex is-align-self-flex-start">
      <SidebarFilter />
      <ItemsGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarFilter from '@/components/explore/SidebarFilter.vue'
import ItemsGrid from './ItemsGrid/ItemsGrid.vue'
</script>

<template>
  <div>
    <ModalIdentityItem />
  </div>

  <slot />

  <div class="min-height">
    <SkeletonLoader :title="title" :subtitle="subtitle" />
  </div>
</template>

<script setup lang="ts">
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import SkeletonLoader from '@/components/shared/SkeletonLoader.vue'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<style lang="scss" scoped>
.min-height {
  height: 200px;
}
</style>

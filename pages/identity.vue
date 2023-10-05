<template>
  <Identity />
</template>

<script lang="ts" setup>
import Identity from '@/components/common/IdentityForm.vue'

definePageMeta({
  layout: 'centered-half-layout',
})

useSeoMeta({
  title: 'Identity',
  description: 'Create your on-chain identity',
  ogUrl: '/identity',
})
</script>

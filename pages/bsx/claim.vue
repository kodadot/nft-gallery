<template>
  <ClaimForm />
</template>

<script lang="ts" setup>
import ClaimForm from '@/components/poap/claim/ClaimForm.vue'

definePageMeta({
  layout: 'centered-half-layout',
})
useSeoMeta({
  title: 'Claim',
  ogType: 'article',
  description: 'Create carbonless NFTs with low on-chain fees',
  ogUrl: '/bsx/claim',
})
</script>

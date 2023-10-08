<template>
  <PoapClaimForm />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'centered-half-layout',
})

useHead({
  title: 'Claim',
  meta: [
    {
      name: 'description',
      content: 'Claim carbonless NFTs with low on-chain fees',
    },
  ],
})
</script>

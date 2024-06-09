<template>
  <Settings />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'no-footer',
})

useHead({
  title: 'Settings',
  meta: [
    {
      name: 'description',
      content: 'Configure your KodaDot experience',
    },
  ],
})
</script>

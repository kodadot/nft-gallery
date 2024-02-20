<template>
  <CodeChecker />
</template>

<script lang="ts" setup>
const route = useRoute()

useSeoMeta({
  title: 'Code Checker',
  description:
    'Check your generative art code. Drop your file, check for essentials, and optimize. Preview, iterate, and finalize with confidence. Start now.',
  ogUrl: route.path,
})

definePageMeta({
  layout: 'no-footer',
})
</script>

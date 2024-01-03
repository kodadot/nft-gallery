<template>
  <LandingPage />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'full-width-layout',
  middleware: [
    () => {
      const router = useRouter()
      router.push({ path: '/' })
    },
  ],
})
</script>

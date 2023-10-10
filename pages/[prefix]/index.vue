<template>
  <LandingPage />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'full-width-layout',
})

const router = useRouter()

onBeforeMount(() => {
  router.replace('/')
})
</script>

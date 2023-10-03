<template>
  <LandingPage />
</template>

<script lang="ts" setup>
import LandingPage from '@/components/landing/LandingPage.vue'

definePageMeta({
  layout: 'full-width-layout',
})

const router = useRouter()

onBeforeMount(() => {
  router.replace('/')
})
</script>

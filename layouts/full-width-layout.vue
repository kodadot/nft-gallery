<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1">
      <Error
        v-if="$nuxt.isOffline"
        :has-img="false"
        error-title="Offline Detected"
        error-subtitle="Please check your network connections" />
      <Nuxt v-else />
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
  </div>
</template>

<script lang="ts" setup>
const { $config } = useNuxtApp()
const route = useRoute()

useNuxt2Meta({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})
</script>

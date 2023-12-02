<template>
  <div
    class="min-h-full is-flex is-flex-direction-column is-clipped has-navbar-fixed-top has-spaced-navbar-fixed-top">
    <Navbar />
    <main class="is-flex-grow-1 py-8">
      <div class="container is-fluid">
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected" />
        <NuxtPage v-else />
      </div>
    </main>
    <LazyCookieBanner />
    <Buy />
  </div>
</template>

<script lang="ts" setup>
const { $config } = useNuxtApp()
const route = useRoute()

useHead({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})
</script>

<template>
  <div class="min-h-full flex flex-col is-clipped">
    <Navbar />
    <main class="flex-grow py-8">
      <div class="container px-[1.25rem] md:px-[2.5rem] lg:full-width lg:px-0">
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected" />
        <NuxtPage v-else />
      </div>
    </main>
    <LazyTheFooter />
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

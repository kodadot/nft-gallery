<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />

    <main>
      <ClientOnly>
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-title="Offline Detected"
          error-subtitle="Please check your network connections" />
        <NuxtPage v-else />
      </ClientOnly>
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

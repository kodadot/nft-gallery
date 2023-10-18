<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1 py-8">
      <div class="container is-fluid">
        <ClientOnly>
          <Error
            v-if="$nuxt.isOffline"
            :has-img="false"
            error-title="Offline Detected"
            error-subtitle="Please check your network connections" />
          <NuxtPage v-else />
        </ClientOnly>
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

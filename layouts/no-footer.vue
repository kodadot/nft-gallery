<template>
  <div class="min-h-full flex flex-col overflow-hidden">
    <Navbar />
    <main class="grow py-8 min-h-[calc(100vh-var(--navbar-desktop)-4rem)]">
      <div class="container-fluid">
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected"
        />
        <NuxtPage v-else />
      </div>
    </main>
    <LazyCookieBanner />
    <KeyboardShortcutsModal />
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

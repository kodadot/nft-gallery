<template>
  <div class="min-h-full flex flex-col overflow-hidden">
    <Navbar />
    <main class="grow py-8">
      <div
        class="relative mx-auto my-0 max-lg:px-0! min-h-[3.25rem] w-full"
        :class="{ 'max-w-none md:px-10! px-5!': !isTouch }"
      >
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected"
        />
        <NuxtPage v-else />
      </div>
    </main>
    <LazyTheFooter />
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

const { isMobileOrTablet: isTouch } = useDevice()
</script>

<template>
  <div class="min-h-full flex flex-col is-clipped">
    <Navbar />
    <main class="flex-grow">
      <section class="px-6 py-12">
        <div class="container">
          <div class="flex flex-col md:flex-row justify-center gap-3">
            <div class="w-1/2">
              <Error
                v-if="$nuxt.isOffline"
                :has-img="false"
                error-title="Offline Detected"
                error-subtitle="Please check your network connections" />
              <NuxtPage v-else />
            </div>
          </div>
        </div>
      </section>
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

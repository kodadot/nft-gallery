<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <ClientOnly>
                <Error
                  v-if="$nuxt.isOffline"
                  :has-img="false"
                  error-title="Offline Detected"
                  error-subtitle="Please check your network connections" />
                <NuxtPage v-else />
              </ClientOnly>
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

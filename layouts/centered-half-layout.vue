<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <Error
                v-if="$nuxt.isOffline"
                :has-img="false"
                error-title="Offline Detected"
                error-subtitle="Please check your network connections" />
              <Nuxt v-else />
            </div>
          </div>
        </div>
      </section>
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
  </div>
</template>

<script lang="ts" setup>
const { $config, $store } = useNuxtApp()
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

// TODO: we can remove this watcher
// once we are not rely on `$store.getters.currentUrlPrefix`
onBeforeMount(() => {
  const prefix = route.params.prefix

  if (prefix && prefix !== $store.getters.currentUrlPrefix) {
    $store.dispatch('setUrlPrefix', prefix)
  }
})
</script>

<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <Error
            v-if="$nuxt.isOffline"
            :has-img="false"
            error-subtitle="Please check your network connections"
            error-title="Offline Detected" />
          <Nuxt v-else />
        </div>
      </section>
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
  </div>
</template>

<script lang="ts" setup>
const { $config } = useNuxtApp()
const route = useRoute()
const { checkPrefixBeforeMount } = usePrefix()

useNuxt2Meta({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})

onBeforeMount(checkPrefixBeforeMount)
</script>

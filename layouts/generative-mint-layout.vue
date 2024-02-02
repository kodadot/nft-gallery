<template>
  <div class="min-h-full flex flex-col is-clipped">
    <Navbar />
    <main class="flex-grow">
      <section class="hero is-medium is-link">
        <div class="hero-body">
          <h1 class="subtitle text-center font-bold text-3xl">
            Mint Your {{ NAME }} Waifu
          </h1>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
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
import { NAME } from '@/components/generative/promptBuilder'
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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
.hero .subtitle {
  letter-spacing: -0.02em;
  @include ktheme() {
    color: theme('text-color-inverse');
    text-shadow:
      1px 1px 0 theme('text-color'),
      1px -1px 0 theme('text-color'),
      -1px 1px 0 theme('text-color'),
      -1px -1px 0 theme('text-color'),
      1px 0px 0 theme('text-color'),
      0px 1px 0 theme('text-color'),
      -1px 0px 0 theme('text-color'),
      0px -1px 0 theme('text-color'),
      4px 4px theme('text-color');
  }
}
</style>

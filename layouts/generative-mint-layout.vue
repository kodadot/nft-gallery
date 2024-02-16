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

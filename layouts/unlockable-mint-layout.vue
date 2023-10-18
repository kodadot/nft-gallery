<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />

    <main class="is-flex-grow-1">
      <ClientOnly>
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-title="Offline Detected"
          error-subtitle="Please check your network connections" />
        <NuxtPage v-else />
      </ClientOnly>
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
    <Buy />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
hr {
  @include ktheme() {
    background: theme('k-grey');
  }
}
.text-color {
  @include ktheme() {
    background: theme('text-color');
  }
}

@include touch {
  .mobile-padding {
    padding: 0 1rem;
  }
}
</style>

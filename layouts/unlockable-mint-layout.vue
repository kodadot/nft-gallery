<template>
  <div class="min-h-full flex flex-col is-clipped">
    <Navbar />

    <main class="flex-grow">
      <NuxtPage />
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

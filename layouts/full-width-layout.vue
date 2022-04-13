<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <main class="is-flex-grow-1">
      <Error
        v-if="$nuxt.isOffline"
        :hasImg="false"
        errorTitle="Offline Detected"
        errorSubtitle="Please check your network connections" />
      <Nuxt v-else />
    </main>
    <LazyFooter />
  </div>
</template>

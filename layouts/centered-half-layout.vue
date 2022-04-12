<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <Error
                v-if="$nuxt.isOffline"
                :hasImg="false"
                errorTitle="Offline Detected"
                errorSubtitle="Please check your network connections" />
              <Nuxt v-else />
            </div>
          </div>
        </div>
      </section>
    </main>
    <LazyFooter />
  </div>
</template>

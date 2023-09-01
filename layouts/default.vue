<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1 py-8">
      <div class="container is-fluid">
        <form>
          <label for="locale-select">language: </label>
          <select id="locale-select" v-model="lang" @change="changeLanguage">
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="es">es</option>
          </select>
        </form>
        <Error
          v-if="$nuxt.isOffline"
          :has-img="false"
          error-subtitle="Please check your network connections"
          error-title="Offline Detected" />
        <NuxtPage v-else />
      </div>
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
    <Buy />
  </div>
</template>

<script lang="ts" setup>
const { $config, $i18n } = useNuxtApp()
const route = useRoute()

const lang = ref('en')
function changeLanguage() {
  $i18n.locale.value = lang.value
}
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

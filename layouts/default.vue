<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1 py-8">
      <div class="container is-fluid">
        <h1 class="title is-1">HELLO WORLD</h1>
        <font-awesome-icon icon="fa-solid fa-fire" />
        <NeoIcon icon="fire" />
        <NeoButton>Noice</NeoButton>
        <form>
          <label for="locale-select">{{ $t('language') }}: </label>
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
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const { $config, $i18n } = useNuxtApp()
const route = useRoute()
onMounted(() => {
  $i18n.locale.value = 'es'

  setTimeout(() => {
    $i18n.locale.value = 'en'
  }, 5000)
})

const lang = ref('es')
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

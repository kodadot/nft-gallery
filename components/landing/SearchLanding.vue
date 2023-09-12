<template>
  <section class="landing-search is-flex is-align-items-center">
    <img
      src="/landing-blurred-header-left.png"
      class="landing-search-left"
      alt="" />
    <img :src="landingImage[0]" class="landing-shapes" alt="" />
    <div
      class="is-flex is-flex-direction-column is-align-items-center search-info">
      <h1
        class="title is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center mb-0">
        {{ $t('search.landingTitle1') }}
        <span
          class="subtitle is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered is-capitalized ml-4">
          {{ $t('search.landingTitle2') }}
        </span>
      </h1>
      <h1
        class="title is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered">
        {{ $t('search.landingTitle3') }}
      </h1>
      <Search
        hide-filter
        class="landing-search-bar"
        search-column-class="is-flex-grow-1" />
      <div
        id="networkList"
        class="is-flex is-justify-content-center is-flex-wrap-wrap is-align-items-baseline">
        <a
          v-for="chain in availableChains"
          :key="chain.value"
          v-safe-href="`/${chain.value}/explore/collectibles`"
          :class="['m-2', 'chain-option active']"
          @click.prevent="switchChain(chain.value)">
          {{ chainText(chain.text) }}
          <sup v-if="chain.text.includes('[Beta]')" class="beta-text is-size-7">
            {{ $t('beta') }}</sup
          >
        </a>
      </div>
      <UnlockableLandingTag />
    </div>
    <img
      src="/landing-blurred-header-right.png"
      class="landing-search-right"
      alt="" />
    <img :src="landingImage[1]" class="landing-shapes" alt="" />
  </section>
</template>

<script lang="ts" setup>
import UnlockableLandingTag from '@/components/collection/unlockable/UnlockableLandingTag.vue'
import Search from '@/components/search/Search.vue'

const { urlPrefix, setUrlPrefix } = usePrefix()
const { isDarkMode } = useTheme()
const { availableChains } = useChain()

const chainText = (chain: string) => {
  if (chain.includes('[Beta]')) {
    return chain.split(' ')[0]
  } else {
    return chain
  }
}
const landingImage = computed(() => {
  if (isDarkMode.value) {
    return [
      '/landing-shape-header-left-dark.svg',
      '/landing-shape-header-right-dark.svg',
    ]
  } else {
    return [
      '/landing-shape-header-left-light.svg',
      '/landing-shape-header-right-light.svg',
    ]
  }
})

const switchChain = (value) => {
  if (value !== urlPrefix.value) {
    setUrlPrefix(value)
  }
  navigateTo(`/${value}/explore/collectibles`)
}
</script>

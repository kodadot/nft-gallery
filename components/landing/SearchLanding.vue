<template>
  <section class="landing-search flex items-center">
    <img
      src="/landing-blurred-header-left.webp"
      class="landing-search-left"
      width="740"
      height="1000"
      alt="" />
    <img :src="landingImage[0]" class="landing-shapes" alt="" />
    <div class="flex flex-col items-center search-info">
      <h1
        class="title is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered flex flex-wrap justify-center items-center mb-0">
        {{ $t('search.landingTitle1') }}
        <span
          class="subtitle is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered capitalize ml-4">
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
        search-column-class="flex-grow" />
      <div
        id="networkList"
        class="flex justify-center flex-wrap items-baseline mt-4">
        <a
          v-for="chain in availableChains"
          :key="chain.value"
          v-safe-href="`/${chain.value}/explore/collectibles`"
          :class="['mx-4 mb-4', 'chain-option active']"
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
      src="/landing-blurred-header-right.webp"
      class="landing-search-right"
      width="740"
      height="1000"
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
  const lightOrDark = isDarkMode.value ? 'dark' : 'light'

  return [
    `/landing-shape-header-left-${lightOrDark}.svg`,
    `/landing-shape-header-right-${lightOrDark}.svg`,
  ]
})

const switchChain = (value) => {
  if (value !== urlPrefix.value) {
    setUrlPrefix(value)
  }
  navigateTo(`/${value}/explore/collectibles`)
}
</script>

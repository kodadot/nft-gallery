<template>
  <section
    class="landing-search is-flex is-justify-content-space-between is-align-items-center">
    <img src="/landing-blurred-header-left.svg" class="landing-search-left" />
    <img :src="landingImage[0]" class="landing-shapes" />
    <div
      class="is-flex is-flex-direction-column is-align-items-center search-info">
      <h1
        class="title is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered">
        <span>{{ $t('search.landingTitle1') }}</span>
        {{ $t('search.landingTitle2') }}
        <span> {{ $t('search.landingTitle3') }}</span>
      </h1>
      <span
        class="subtitle is-size-1 is-size-2-mobile has-text-weight-bold has-text-centered is-capitalized">
        {{ $t('search.landingSubtitle') }}
      </span>
      <LazySearch
        hide-filter
        class="landing-search-bar"
        search-column-class="is-flex-grow-1" />
      <div
        id="networkList"
        class="is-flex is-justify-content-center is-flex-wrap-wrap is-align-items-baseline">
        <a
          v-for="chain in chainList"
          :key="chain.value"
          :class="['m-2', 'chain-option active']"
          @click="switchChain(chain.value)">
          {{ chainText(chain.text) }}
          <sup v-if="chain.text.includes('[Beta]')" class="beta-text is-size-7">
            {{ $t('beta') }}</sup
          >
        </a>
      </div>
    </div>
    <img src="/landing-blurred-header-right.svg" class="landing-search-right" />
    <img :src="landingImage[1]" class="landing-shapes" />
  </section>
</template>

<script lang="ts" setup>
import { Option } from '@kodadot1/vuex-options/dist/types'

import { getChainTestList } from '~/utils/constants'

const { urlPrefix } = usePrefix()
const { $store, $colorMode, $router } = useNuxtApp()
const isDarkMode = computed(
  () =>
    $colorMode.preference === 'dark' ||
    document.documentElement.className.includes('dark-mode')
)

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

const chainList = computed(() => {
  const availableUrlPrefixes: Option[] = $store.getters['availableUrlPrefixes']
  return availableUrlPrefixes.filter(
    (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
  )
})

const switchChain = (value) => {
  if (value === urlPrefix.value) {
    return
  }
  $store.dispatch('setUrlPrefix', value)
  $router.push({ path: `/${value}/explore` })
}
</script>

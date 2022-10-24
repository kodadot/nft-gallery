<template>
  <section
    class="landing-search is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
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
      class="landing-search-bar is-flex-grow-1 pb-0 mb-2"
      search-column-class="is-flex-grow-1" />
    <div
      class="is-flex is-flex-grow-1 is-justify-content-center is-flex-wrap-wrap">
      <a
        v-for="chain in chainList"
        :key="chain.value"
        :class="['mr-2', 'chain-option', { active: urlPrefix === chain.value }]"
        @click="switchChain(chain.value)">
        {{ chain.text }}
      </a>
    </div>
    <img class="landing-search-left is-hidden-touch" :src="landingImage[0]" />
    <img class="landing-search-right is-hidden-touch" :src="landingImage[1]" />
  </section>
</template>

<script lang="ts" setup>
import { Option } from '@kodadot1/vuex-options/dist/types'

import { getChainTestList } from '~/utils/constants'

const { urlPrefix } = usePrefix()
const { $store, $colorMode } = useNuxtApp()
const isDarkMode = computed(() => $colorMode.preference === 'dark')

const landingImage = computed(() => {
  if (isDarkMode.value) {
    return ['/landing-search-left-dark.svg', '/landing-search-right-dark.svg']
  } else {
    return ['/landing-search-left.svg', '/landing-search-right.svg']
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
  window.location.reload()
}
</script>

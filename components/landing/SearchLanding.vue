<template>
  <section
    class="landing-search is-flex is-justify-content-center is-align-items-center">
    <img :src="landingImage[0]" class="landing-search-left" />
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
      <div class="is-flex is-justify-content-center is-flex-wrap-wrap">
        <a
          v-for="chain in chainList"
          :key="chain.value"
          :class="[
            'mr-2 mb-2',
            'chain-option',
            { active: urlPrefix === chain.value },
          ]"
          @click="switchChain(chain.value)">
          {{ chain.text }}
        </a>
      </div>
    </div>
    <img :src="landingImage[1]" class="landing-search-right" />
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

const landingImage = computed(() => {
  if (isDarkMode.value) {
    return [
      '/blurred-landing-header-dark.svg',
      '/blurred-landing-header-right-dark.svg',
    ]
  } else {
    return ['/blurred-landing-header.svg', '/blurred-landing-header-right.svg']
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

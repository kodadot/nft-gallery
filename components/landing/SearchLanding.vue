<template>
  <section
    class="landing-search is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
    <div class="title">
      <span>{{ $t('search.landingTitle1') }}</span>
      {{ $t('search.landingTitle2') }}
      <span> {{ $t('search.landingTitle3') }}</span>
    </div>
    <span class="sub-title"> {{ $t('search.landingSubtitle') }}</span>
    <LazySearch
      hide-filter
      show-default-suggestions
      class="landing-search-bar is-flex-grow-1 pb-0 mb-2"
      search-column-class="is-flex-grow-1" />
    <div class="if-flex is-flex-grow-1 mb-4">
      <span
        v-for="chain in chainList"
        :key="chain.value"
        :class="[
          'mr-2',
          'chain-option',
          { active: urlPrefix === chain.value },
        ]">
        {{ chain.text }}
      </span>
    </div>
    <img class="landing-search-left is-hidden-touch" :src="landingImage[0]" />
    <img class="landing-search-right is-hidden-touch" :src="landingImage[1]" />
  </section>
</template>

<script lang="ts" setup>
import { Option } from '@kodadot1/vuex-options/dist/types'

import { chainTestList } from '~/utils/constants'

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
    (urlPrefix) =>
      !chainTestList.includes(urlPrefix.value as string) &&
      urlPrefix.value !== 'bsx'
  )
})
</script>

<style lang="scss">
@import '@/styles/components/_search';
</style>

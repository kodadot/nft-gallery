<template>
  <section class="landing-search is-flex is-align-items-center">
    <LandingBlurHeaderLeft class="landing-search-left" />
    <LandingImageLeft class="landing-shapes" />
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
    <LandingBlurHeaderRight class="landing-search-right" />
    <LandingImageRight class="landing-shapes" />
  </section>
</template>

<script lang="ts" setup>
import { Option } from '@kodadot1/vuex-options/dist/types'

import { getChainTestList } from '~/utils/constants'

import LandingHeaderLeftDark from '@/static/landing-shape-header-left-dark.svg?inline'
import LandingHeaderRightDark from '@/static/landing-shape-header-right-dark.svg?inline'
import LandingHeaderLeftLight from '@/static/landing-shape-header-left-light.svg?inline'
import LandingHeaderRightLight from '@/static/landing-shape-header-right-light.svg?inline'

import LandingBlurHeaderLeft from '@/static/landing-blurred-header-left.svg?inline'
import LandingBlurHeaderRight from '@/static/landing-blurred-header-right.svg?inline'

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
const LandingImageLeft = isDarkMode.value
  ? LandingHeaderLeftDark
  : LandingHeaderLeftLight
const LandingImageRight = isDarkMode.value
  ? LandingHeaderRightDark
  : LandingHeaderRightLight

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
  $router.push({ path: `/${value}/explore/collectibles` })
}
</script>

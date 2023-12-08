<template>
  <section class="landing-search is-flex is-align-items-center">
    <img
      src="/landing-blurred-header-left.webp"
      class="landing-search-left"
      width="740"
      height="1000"
      alt="" />
    <ThemedImage src="landing-shape-header-left" class="landing-shapes" />
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
        class="is-flex is-justify-content-center is-flex-wrap-wrap is-align-items-baseline mt-4">
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
    <ThemedImage
      src="landing-shape-header-right"
      class="landing-shapes landing-shapes-right" />
  </section>
</template>

<script lang="ts" setup>
import UnlockableLandingTag from '@/components/collection/unlockable/UnlockableLandingTag.vue'
import Search from '@/components/search/Search.vue'

const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChains } = useChain()

const chainText = (chain: string) => {
  if (chain.includes('[Beta]')) {
    return chain.split(' ')[0]
  } else {
    return chain
  }
}

const switchChain = (value) => {
  if (value !== urlPrefix.value) {
    setUrlPrefix(value)
  }
  navigateTo(`/${value}/explore/collectibles`)
}
</script>

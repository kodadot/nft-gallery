<template>
  <section class="is-relative landing-search is-flex is-align-items-center">
    <img
      class="landing-image"
      src="/landing-mobile-shape.svg"
      alt="landing page background" />
    <div
      class="is-flex is-flex-direction-column is-align-items-center search-info">
      <h1 class="is-flex is-flex-direction-column is-align-items-center">
        <span class="title is-size-3 has-text-weight-bold">
          {{ $t('search.landingTitle1') }}
        </span>
        <span class="subtitle is-size-3 has-text-weight-bold is-capitalized">
          {{ $t('search.landingTitle2') }}
        </span>
        <span class="title is-size-3 has-text-weight-bold">
          {{ $t('search.landingTitle3') }}
        </span>
      </h1>

      <div class="with-divider chain-options-title is-size-6 mt-6">
        {{ $t('landing.startExploring') }}
      </div>
      <div
        class="is-flex is-justify-content-center is-flex-wrap-wrap is-align-items-baseline mt-4">
        <a
          v-for="chain in chains"
          :key="chain.value"
          v-safe-href="`/${chain.value}/explore/collectibles`"
          :class="[
            'mx-2 mb-3 is-inline-flex is-align-items-center',
            'chain-option active',
          ]"
          @click.prevent="switchChain(chain.value)">
          <img
            class="is-size-5 chain-icon"
            :src="chain.icon"
            :alt="chain.text" />
          <span>{{ chainText(chain.text) }}</span>
          <sup v-if="chain.text.includes('[Beta]')" class="beta-text is-size-7">
            {{ $t('beta') }}</sup
          >
        </a>
      </div>
      <CollectionUnlockableLandingMobileBanner />
    </div>
  </section>
</template>

<script lang="ts" setup>
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChainsWithIcon } = useChain()

const chains = computed(() => {
  if (isProduction) {
    return availableChainsWithIcon.value.filter((c) =>
      popularChains.includes(String(c.value)),
    )
  }
  return availableChainsWithIcon.value
})

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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.landing-image {
  position: absolute;
  top: -70px;
}

.chain-options-title {
  @include ktheme() {
    color: theme('link-hover');
  }
}

.with-divider {
  display: flex;
  align-items: center;

  &:before,
  &:after {
    content: '';
    display: block;
    width: 36px;
    height: 1px;

    @include ktheme() {
      background-color: theme('link-hover');
    }
  }

  &:before {
    margin-right: 14px;
  }

  &:after {
    margin-left: 14px;
  }
}

.chain-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 6px;
}
</style>

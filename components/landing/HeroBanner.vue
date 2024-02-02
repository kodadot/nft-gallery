<template>
  <section
    :class="[
      'relative landing-search flex items-center',
      isMobile ? 'mt-6' : 'my-8',
    ]">
    <img
      v-if="isMobile"
      class="landing-image"
      src="/landing-mobile-shape.svg"
      alt="landing page background" />
    <template v-else>
      <img
        src="/landing-blurred-header-left.webp"
        class="landing-search-left"
        width="740"
        height="1000"
        alt="landing-left-bg" />
      <img
        :src="landingImage[0]"
        class="landing-shapes"
        alt="landing-left-image" />
    </template>

    <div class="flex flex-col items-center search-info">
      <h1 v-if="isMobile" class="flex flex-col items-center">
        <span class="title is-size-3 font-bold">
          {{ $t('search.landingTitle1') }}
        </span>
        <span class="subtitle is-size-3 font-bold capitalize">
          {{ $t('search.landingTitle2') }}
        </span>
        <span class="title is-size-3 font-bold">
          {{ $t('search.landingTitle3') }}
        </span>
      </h1>
      <template v-else>
        <h1
          class="title sm:text-5xl text-4xl font-bold text-center flex flex-col flex-wrap justify-center items-center mb-0">
          <div>
            {{ $t('search.landingTitle1') }}
            <span
              class="subtitle sm:text-5xl text-4xl font-bold text-center capitalize ml-4">
              {{ $t('search.landingTitle2') }}
            </span>
          </div>
          <div>
            {{ $t('search.landingTitle3') }}
          </div>
        </h1>
      </template>

      <div class="with-divider chain-options-title is-size-6 mt-6">
        {{ $t('landing.startExploring') }}
      </div>
      <div class="flex justify-center flex-wrap items-baseline mt-4">
        <nuxt-link
          v-for="chain in chains"
          :key="chain.value"
          :to="`/${chain.value}/explore/collectibles`"
          :class="['mx-2 mb-3 inline-flex items-center', 'chain-option active']"
          @click="switchChain(chain.value)">
          <img
            class="is-size-5 chain-icon"
            :src="chain.icon"
            :alt="chain.text" />
          <span>{{ chainText(chain.text) }}</span>
          <sup v-if="chain.text.includes('[Beta]')" class="beta-text text-xs">
            {{ $t('beta') }}</sup
          >
        </nuxt-link>
      </div>
      <CollectionUnlockableLandingMobileBanner v-if="isMobile" />
      <CollectionUnlockableLandingTag v-else />
    </div>

    <template v-if="!isMobile">
      <img
        src="/landing-blurred-header-right.webp"
        class="landing-search-right"
        width="740"
        height="1000"
        alt="landing-right-bg" />
      <img
        :src="landingImage[1]"
        class="landing-shapes"
        alt="landing-right-image" />
    </template>
  </section>
</template>

<script lang="ts" setup>
const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 480)
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChainsWithIcon } = useChain()
const { isDarkMode } = useTheme()

const landingImage = computed(() => {
  const lightOrDark = isDarkMode.value ? 'dark' : 'light'

  return [
    `/landing-shape-header-left-${lightOrDark}.svg`,
    `/landing-shape-header-right-${lightOrDark}.svg`,
  ]
})

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
  }
  return chain
}

const switchChain = (value) => {
  if (value !== urlPrefix.value) {
    setUrlPrefix(value)
  }
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

<template>
  <section class="pt-6 md:!pt-[3.5rem]">
    <div class="relative">
      <img
        src="~/assets/svg/landing-blur.svg"
        alt="Hero banner background blur"
        class="-z-10 absolute -translate-x-2/4 left-2/4 top-[-9rem] scale-120 md:scale-125 md:top-[-14rem] pointer-events-none" />

      <h1
        class="break-all text-3xl md:text-5xl font-bold text-center flex flex-col md:flex-row md:gap-5 flex-wrap justify-center items-center mb-0">
        <div>
          {{ $t('search.landingTitle1') }}
        </div>
        <span
          class="inverse-text text-3xl md:text-5xl font-bold text-center capitalize md:inline">
          {{ $t('search.landingTitle2') }}
        </span>
        <div>
          {{ $t('search.landingTitle3') }}
        </div>
      </h1>
      <div class="container is-fluid flex justify-center mt-[2rem]">
        <LandingFarcasterMintNotificationBanner
          v-if="farcasterLiveMint"
          :config="farcasterLiveMint" />
        <LandingFarcasterBanner v-else />
      </div>

      <div class="flex justify-center mt-[2rem]">
        <p class="with-divider capitalize text-base">
          {{ $t('landing.featuredGenerativeDrops') }}
        </p>
      </div>
    </div>

    <div class="container is-fluid mt-6 md:mt-8 mb-16">
      <CarouselTypeDrops />
    </div>
  </section>
</template>

<script lang="ts" setup>
import farcasterLiveMintConfig from '@/script/farcasterLiveMint.json'

const farcasterLiveMint = ref()

const fetchFarcasterLiveMint = async () => {
  if (isProduction) {
    try {
      const res: string = await $fetch(
        'https://raw.githubusercontent.com/kodadot/nft-gallery/main/script/farcasterLiveMint.json',
        {
          method: 'GET',
        },
      )
      const config = JSON.parse(res)
      if (config) {
        farcasterLiveMint.value = config
      }
    } catch (error) {
      // no live mint
    }
  } else {
    farcasterLiveMint.value = farcasterLiveMintConfig
  }
}

onMounted(fetchFarcasterLiveMint)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
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
</style>

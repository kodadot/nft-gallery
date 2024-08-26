<template>
  <section class="!pt-8 md:!pt-[3rem]">
    <div class="container is-fluid flex max-md:flex-col max-md:gap-8 justify-center md:justify-between items-center">
      <h1
        class="text-3xl md:text-[39px] md:leading-9 font-bold flex max-md:flex-col max-md:text-center md:gap-3 md:flex-wrap"
      >
        <span>
          {{ $t('search.landingTitle1') }}
        </span>
        <span
          class="inverse-text"
        >
          {{ $t('search.landingTitle2') }}
        </span>
        <span>
          {{ $t('search.landingTitle3') }}
        </span>
      </h1>

      <div class="flex-shrink-0">
        <LandingDomainChangeNotificationBanner
          v-if="!isLatestProductionDomain"
        />
        <LandingFarcasterMintNotificationBanner
          v-else-if="farcasterLiveMint"
          :config="farcasterLiveMint"
        />
        <LandingFarcasterBanner v-else />
      </div>
    </div>

    <div
      :key="usePrefix().urlPrefix.value"
      class="container is-fluid !mt-8 md:!mt-[3rem] mb-16"
    >
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
    }
    catch (error) {
      // no live mint
    }
  }
  else {
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

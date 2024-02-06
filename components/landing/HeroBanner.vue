<template>
  <section class="landing-hero pt-6 md:pt-[56px]">
    <img
      src="/landing-blur.svg"
      alt="Hero banner background blur"
      class="top-[10px] scale-150 md:scale-125 md:top-[-6rem] -translate-x-2/4 left-2/4 absolute pointer-events-none" />

    <div class="relative">
      <h1
        class="break-all is-size-1 is-size-2-mobile font-bold text-center flex flex-col flex-wrap justify-center items-center mb-0">
        <div>
          {{ $t('search.landingTitle1') }}
          <span
            class="subtitle is-size-1 is-size-2-mobile font-bold text-center capitalize block md:inline">
            {{ $t('search.landingTitle2') }}
          </span>
        </div>
        <div>
          {{ $t('search.landingTitle3') }}
        </div>
      </h1>

      <div class="flex justify-center">
        <div class="with-divider is-size-6 mt-6 md:mt-[50px] capitalize">
          {{ $t('landing.featuredGenerativeDrops') }}
        </div>
      </div>
    </div>

    <div class="container is-fluid mt-6 md:mt-8 mb-16">
      <LazyCarouselTypeDrops />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.landing-hero {
  .subtitle {
    letter-spacing: -0.02em;
    @include ktheme() {
      color: theme('text-color-inverse');
      text-shadow:
        1px 1px 0 theme('text-color'),
        1px -1px 0 theme('text-color'),
        -1px 1px 0 theme('text-color'),
        -1px -1px 0 theme('text-color'),
        1px 0px 0 theme('text-color'),
        0px 1px 0 theme('text-color'),
        -1px 0px 0 theme('text-color'),
        0px -1px 0 theme('text-color'),
        4px 4px theme('text-color');
    }
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
</style>

<template>
  <section class="pt-6 md:!pt-[3.5rem]">
    <div class="relative">
      <img
        src="/landing-blur.svg"
        alt="Hero banner background blur"
        class="-z-10 absolute -translate-x-2/4 left-2/4 top-[-9rem] scale-120 md:scale-125 md:top-[-14rem] pointer-events-none" />

      <h1
        class="break-all text-3xl md:text-5xl font-bold text-center flex flex-col flex-wrap justify-center items-center mb-0">
        <div>
          {{ $t('search.landingTitle1') }}
          <span
            class="inverse-text text-3xl md:text-5xl font-bold text-center capitalize block md:inline">
            {{ $t('search.landingTitle2') }}
          </span>
        </div>
        <div>
          {{ $t('search.landingTitle3') }}
        </div>
      </h1>

      <div class="flex justify-center mt-6 md:!mt-12">
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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.inverse-text {
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

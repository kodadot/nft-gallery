<template>
  <section class="homepage section">
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column">
          <h3
            class="title is-1 is-size-3-mobile is-flex is-flex-direction-column is-uppercase homepage__heading">
            <span class="text__stroked my-5">
              {{ $t('general.ksmDiscoverText') }}
            </span>
            <span
              class="title is-6 homepage__subtitle is-uppercase has-text-weight-semibold">
              {{ $t('helper.builtOn') }}
              <span class="has-text-weight-bold has-text-primary">
                {{ buildOn }}
              </span>
            </span>
          </h3>
          <a
            href="https://discord.gg/35hzy2dXXh"
            target="_blank"
            rel="noopener noreferrer">
            <img
              src="https://badgen.net/discord/online-members/35hzy2dXXh"
              alt="Discord"
              width="354"
              height="40"
              style="width: 177px" />
          </a>
        </div>
        <div class="column">
          <LazyCuratedList />
        </div>
      </div>
      <div class="mt-6">
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6">
              <div class="tile is-child box">
                <p class="title">{{ $t('landing.newNftHeading') }}</p>
                <i18n
                  path="landing.newNft.click"
                  tag="p"
                  for="landing.newNft.here"
                  class="subtitle">
                  <a href="https://docs.kodadot.xyz">{{
                    $t('landing.newNft.here')
                  }}</a>
                </i18n>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="tile is-child box">
                <p class="title">{{ $t('landing.ksmArtistHeading') }}</p>
                <i18n
                  path="landing.artists.hook"
                  tag="p"
                  for="landing.artists.touch"
                  class="subtitle">
                  <a href="https://discord.gg/35hzy2dXXh">{{
                    $t('landing.artists.touch')
                  }}</a>
                </i18n>
              </div>
            </div>
          </div>
        </div>
        <div class="tile">
          <div
            class="box is-flex is-align-items-center is-justify-content-space-between">
            <div class="tile is-parent is-6">
              <p class="subtitle">
                {{ $t('landing.socials') }}
              </p>
            </div>
            <KodadotSocialLinks />
          </div>
        </div>
      </div>
      <div v-if="prefix === 'rmrk' || prefix === 'bsx' || prefix === 'snek'">
        <LazyTopCollections v-if="prefix !== 'bsx'" class="my-5" />
        <LazyCarouselTypePopularCollection
          v-if="prefix === 'rmrk'"
          class="my-5" />
        <LazyCarouselTypeLatestSales class="my-5" />
        <LazyCarouselTypeNewestList class="my-5" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import KodadotSocialLinks from '@/components/shared/KodadotSocialLinks.vue'

defineProps({
  prefix: {
    type: String,
    default: 'rmrk',
    required: true,
  },
  buildOn: {
    type: String,
    default: 'RMRK Protocol',
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

@include mobile {
  .homepage.section {
    padding-top: 0;
  }

  .box {
    flex-direction: column;
  }
}

.homepage {
  content: '';
  width: 100%;
  height: 100%;
  color: $text;

  &__heading {
    font-size: 4rem;
    color: $text;
  }

  .tile .box {
    width: 100%;
    border: 1px solid #3f3f3f;
    border-radius: 12px;
    box-sizing: border-box;
    box-shadow: $dropdown-content-shadow;

    .title {
      color: $primary !important;
    }
  }
}
.title {
  word-break: normal;
}
</style>

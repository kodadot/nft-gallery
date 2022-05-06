<template>
  <section class="homepage section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h3
            class="title is-1 is-size-3-mobile is-flex is-flex-direction-column uppercase homepage__heading">
            <span class="text__stroked my-5">
              Discover, collect and sell Kusama NFTs
            </span>
            <span class="title is-6 homepage__subtitle uppercase text-semibold">
              Built on
              <span class="text-bold text-primary"> {{ buildOn }} </span>
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
          <LazyGalleryCuratedList v-if="prefix === 'rmrk'" />
        </div>
      </div>
      <div class="pt-6">
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6">
              <div class="tile is-child box">
                <p class="title">New to NFTs?</p>
                <p class="subtitle">
                  Click <a href="https://docs.kodadot.xyz">here</a> for a step
                  by step guide!
                </p>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="tile is-child box">
                <p class="title">KSM for artists</p>
                <p class="subtitle">
                  Get in <a href="https://discord.gg/35hzy2dXXh">touch</a> and
                  we will hook you up with free mints.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="tile">
          <div
            class="box is-flex is-align-items-center is-justify-content-space-between">
            <div class="tile is-parent is-6">
              <p class="subtitle">
                Got any questions or would like to stay in touch? Drop us a line
                via socials.
              </p>
            </div>
            <KodadotSocialLinks />
          </div>
        </div>
      </div>
      <div v-if="prefix === 'rmrk'">
        <LazyGalleryNewestList class="my-5" />
        <LazyGalleryLatestSales class="my-5" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component<Landing>({
  components: {
    KodadotSocialLinks: () =>
      import('~/components/shared/KodadotSocialLinks.vue'),
  },
})
export default class Landing extends Vue {
  @Prop({ type: String, required: true, default: 'rmrk' }) prefix!: string
  @Prop({ type: String, default: 'RMRK Protocol' }) buildOn!: string
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

@include mobile {
  .homepage.section {
    padding-top: 0;
  }
}

.homepage {
  content: '';
  width: 100%;
  height: 100%;
  color: $text;

  &__title {
    display: inline-flex;
    padding: 16px 32px;
    margin: 0 0 60px;
    text-transform: uppercase;
    border: 4px solid $primary;
  }

  &__heading {
    font-size: 4rem;
    color: $text;
  }

  .tile .box {
    width: 100%;
    border: 1px solid #3f3f3f;
    border-radius: 12px;
    box-sizing: border-box;
    // filter: drop-shadow(-10px 4px 20px #3f3f3f);
    box-shadow: -10px 4px 20px #3f3f3f;

    .title {
      color: $primary !important;
    }
  }
}
.title {
  word-break: normal;
}
</style>

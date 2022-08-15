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
      <div v-if="prefix === 'rmrk' || prefix === 'bsx'">
        <LazyGalleryLatestSales class="my-5" />
        <span v-if="prefix === 'rmrk'">
          <LazyGalleryPopularCollections class="my-5" />
        </span>
        <LazyGalleryNewestList class="my-5" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
// import passionQuery from '@/queries/rmrk/subsquid/passionFeed.graphql'
import AuthMixin from '@/utils/mixins/authMixin'

@Component<Landing>({
  components: {
    KodadotSocialLinks: () =>
      import('~/components/shared/KodadotSocialLinks.vue'),
  },
})
export default class Landing extends mixins(AuthMixin) {
  @Prop({ type: String, required: true, default: 'rmrk' }) prefix!: string
  @Prop({ type: String, default: 'RMRK Protocol' }) buildOn!: string

  // private passionList: string[] = ['']

  // async created() {
  //   if (this.isLogIn) {
  //     const result = await this.fetchPassionList()
  //     if (result.length) {
  //       this.passionList = this.passionList.concat(result)
  //     }
  //   }
  // }

  //   public async fetchPassionList() {
  //     const {
  //       data: { passionFeed },
  //     } = await this.$apollo.query({
  //       query: passionQuery,
  //       client: 'subsquid',
  //       variables: {
  //         account: this.accountId,
  //       },
  //     })
  //     return passionFeed?.map((item) => item.id) || []
  //   }
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

  &__heading {
    font-size: 4rem;
    color: $text;
  }

  .tile .box {
    width: 100%;
    border: 1px solid #3f3f3f;
    border-radius: 12px;
    box-sizing: border-box;
    box-shadow: -8px 4px 8px #3f3f3f;

    .title {
      color: $primary !important;
    }
  }
}
.title {
  word-break: normal;
}
</style>

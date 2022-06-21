<template>
  <section class="homepage section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <picture>
            <source srcset="~/assets/KODADOT.webp" type="image/webp" />
            <source srcset="~/assets/KODADOT.png" type="image/png" />
            <img
              src="~/assets/KODADOT.png"
              alt="First NFT market explorer on Kusama and Polkadot"
              class="mb-5 is-hidden-mobile"
              width="950"
              height="165"
              loading="lazy" />
          </picture>
          <h3
            class="title is-1 is-size-3-mobile is-flex is-flex-direction-column uppercase homepage__heading">
            <span class="text__stroked my-5">
              {{ $t('general.ksmDiscoverText') }}
            </span>
            <span class="title is-6 homepage__subtitle uppercase text-semibold">
              {{ $t('helper.builtOn') }}
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
          <LazyCuratedList />
        </div>
      </div>
      <div v-if="prefix === 'rmrk'">
        <span
          v-if="isLogIn"
          class="homepage__toggle"
          type="is-text"
          @click="togglePassionValue"
          >Show {{ hasPassionFeed ? 'global' : 'personalized' }} data</span
        >
        <LazyGalleryLatestSales
          :passionList="hasPassionFeed ? passionList : []"
          class="my-5" />
        <LazyGalleryPopularCollections class="my-5" />
        <LazyGalleryNewestList
          :passionList="hasPassionFeed ? passionList : []"
          class="my-5" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import passionQuery from '@/queries/rmrk/subsquid/passionFeed.graphql'
import AuthMixin from '@/utils/mixins/authMixin'

@Component<Landing>({})
export default class Landing extends mixins(AuthMixin) {
  @Prop({ type: String, required: true, default: 'rmrk' }) prefix!: string
  @Prop({ type: String, default: 'RMRK Protocol' }) buildOn!: string

  private passionList: string[] = ['']
  private hasPassionFeed = false

  async created() {
    if (this.isLogIn) {
      this.hasPassionFeed = true
      const result = await this.fetchPassionList()
      if (result.length) {
        this.passionList = this.passionList.concat(result)
      }
    }
  }

  public togglePassionValue() {
    this.hasPassionFeed = !this.hasPassionFeed
  }

  public async fetchPassionList() {
    const {
      data: { passionFeed },
    } = await this.$apollo.query({
      query: passionQuery,
      client: 'subsquid',
      variables: {
        account: this.accountId,
      },
    })
    return passionFeed?.map((item) => item.id) || []
  }
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

  &__toggle {
    text-decoration: underline;
    color: $primary;
    cursor: pointer;
    &:hover {
      color: $white;
    }
  }
}
.title {
  word-break: normal;
}
.subtitle {
  text-decoration: underline;
}

.truncate {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li {
  list-style-type: square;
}
</style>

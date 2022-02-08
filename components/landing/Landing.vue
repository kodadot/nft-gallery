<template>
  <section class="homepage section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <img
            src="~/assets/KODADOT.png"
            alt="First NFT market explorer on Kusama and Polkadot"
            class="mb-5"
            height="60" />
          <h2
            class="title is-1 is-flex is-flex-direction-column uppercase homepage__heading">
            <span> Carbon neutral </span>
            <span class="text__stroked"> Kusama native </span>
            <span> NFT plaftorm </span>
            <span class="title is-6 homepage__subtitle uppercase text-semibold">
              Built on
              <span class="text-bold text-primary"> {{ buildOn }} </span>
            </span>
          </h2>
          <div class="buttons">
            <b-button
              tag="nuxt-link"
              :to="`/${prefix}/create`"
              type="is-primary">
              {{ $t('Create') }}
            </b-button>
            <b-button
              tag="nuxt-link"
              :to="`/${prefix}/collections`"
              type="is-primary">
              Collections
            </b-button>
            <b-button
              tag="nuxt-link"
              :to="`/${prefix}/gallery`"
              type="is-primary">
              Gallery
            </b-button>
            <b-button tag="nuxt-link" to="/spotlight" type="is-primary">
              Spotlight
            </b-button>
            <b-button tag="nuxt-link" to="/series-insight" type="is-primary">
              Series
            </b-button>
            <b-button tag="nuxt-link" to="/about" type="is-primary">
              About
            </b-button>
            <b-button tag="nuxt-link" to="/rmrk/faq" type="is-primary">
              Faq
            </b-button>
            <b-button
              tag="a"
              href="https://tally.so/r/mVP06w"
              target="_blank"
              rel="noopener noreferrer"
              type="is-primary">
              Grants
            </b-button>
            <b-button
              tag="a"
              href="https://en.wikipedia.org/wiki/Non-fungible_token"
              target="_blank"
              rel="noopener noreferrer"
              type="is-primary">
              What are NFTs?
            </b-button>
          </div>
        </div>
        <div
          class="column has-text-right has-text-left-mobile discord-container">
          <a
            href="https://discord.gg/35hzy2dXXh"
            target="_blank"
            rel="noopener noreferrer">
            <img
              src="https://badgen.net/discord/online-members/35hzy2dXXh"
              alt="Discord" />
          </a>
        </div>
      </div>

      <div v-if="prefix === 'rmrk'">
        <LatestSales class="my-5" />
        <NewestList class="my-5" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {
  LatestSales: () => import('@/components/rmrk/Gallery/LatestSales.vue'),
  NewestList: () => import('@/components/rmrk/Gallery/NewestList.vue'),
}
@Component<Landing>({
  components,
})
export default class Landing extends Vue {
  @Prop({ type: String, required: true, default: 'rmrk' }) prefix!: string
  @Prop({ type: String, default: 'RMRK Protocol' }) buildOn!: string
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

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

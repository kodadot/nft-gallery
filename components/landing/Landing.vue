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
          <h3
            class="title is-1 is-flex is-flex-direction-column uppercase homepage__heading">
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
              alt="Discord" />
          </a>
        </div>
        <div class="column">
          <CuratedList v-if="prefix === 'rmrk'" />
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
  CuratedList: () => import('@/components/rmrk/Gallery/CuratedList.vue'),
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

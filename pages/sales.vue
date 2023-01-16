<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('sales.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('sales.subtitle') }}</p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="chain-logo is-hidden-mobile" />
      </div>
    </div>

    <SalesTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Sales>({
  components: {
    Identity: () => import('@/components/identity/IdentityIndex.vue'),
  },
  head() {
    const title = 'Latest KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the most recently sold NFTs on RMRK.',
      url: './sales.vue',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Sales extends Vue {}
</script>

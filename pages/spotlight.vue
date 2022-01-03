<template>
  <section>
    <SpotlightTable />
  </section>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Leaderboard>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot | Kusama NFT Market explorer'
        },
        { property: 'og:url', content: 'https://kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Discover new artists based on the ranking'
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'og:image',
          content: this.defaultSpotlightMetaImage
        },
        {
          property: 'twitter:title',
          content: 'NFT artist ranking'
        },
        {
          property: 'twitter:description',
          content: 'Discover new artists based on the ranking'
        },
        {
          property: 'twitter:image',
          content: this.defaultSpotlightMetaImage
        }
      ]
    }
  },
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    SpotlightTable: () => import('@/components/spotlight/SpotlightTable.vue')
  }
})
export default class Leaderboard extends Vue {
  get defaultSpotlightMetaImage(): string {
    const url = new URL(window.location.href)
    return (
      `${url.protocol}//${url.hostname}/k_card_spotlight.png`
    )
  }
}
</script>

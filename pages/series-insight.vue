<template>
  <section>
    <h1 class="title is-2">{{ $t('series.title') }}</h1>
    <p class="subtitle is-size-5">{{ $t('series.subtitle') }}</p>

    <SeriesTable />
  </section>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Series>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot | Kusama NFT Market explorer'
        },
        { property: 'og:url', content: 'https://nft.kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Discover new artists based on rank'
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'og:image',
          content: this.defaultSeriesMetaImage
        },
        {
          property: 'twitter:title',
          content: 'NFT artist rank'
        },
        {
          property: 'twitter:description',
          content: 'Discover new artists based on rank'
        },
        {
          property: 'twitter:image',
          content: this.defaultSeriesMetaImage
        }
      ]
    }
  },
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    SeriesTable: () => import('@/components/series/SeriesTable.vue')
  }
})
export default class Series extends Vue {
  get defaultSeriesMetaImage(): string {
    const url = new URL(window.location.href)
    return (
      `${url.protocol}//${url.hostname}/kodadot_rank.jpg`
    )
  }
}
</script>

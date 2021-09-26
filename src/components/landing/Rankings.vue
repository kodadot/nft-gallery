<template>
  <div class="columns mb-1">
    <div class="column is-8 is-offset-2">
      <section>
        <h1 class="title is-2">Top Collection</h1>
        <p class="subtitle is-size-5">The top NFTs on RMRK, ranked by score, volume, floor price and other statistics.</p>

        <RankingsTable />
      </section>
    </div>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';

@Component<Rankings>({
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
          content: 'https://nft.kodadot.xyz/kodadot_community.jpeg'
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
          content: 'https://nft.kodadot.xyz/kodadot_community.jpeg'
        }
      ]
    };
  },
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    RankingsTable: () => import('@/components/Rankings/RankingsTable.vue')
  }
})
export default class Rankings extends Vue {}
</script>

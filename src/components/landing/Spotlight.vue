<template>
  <div class="container mb-1">
    <section>
      <SpotlightTable />
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'

@Component<Leaderboard>({
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
  public creators: any = [
    'Dx6nVUy6f2znn4ZwNZ3TGbEyUz3FLbCRGQGKAut4LxjCVRs',
    'J6mwrrDE5ZywDe8T4mWgsdgHCcrDcrVtoGh37i7PSaZARRs',
    'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby',
    'CxQJNQeowRUJBgUHQpspudWy4BU6Rk2u93yDZEKe6GzcLDe',
    'GHuTwhh9txr69tHBM2f1mPE6tWn9XCYKMi3nRNFrYvGv9Yy',
    'CuHWHNcBt3ASMVSJmcJyiBWGxxiWLyjYoYbGjfhL4ovoeSd',
    'ESRGCgBvTnuWkjeQs9G5W5hhXa4XuquXHJMtkDVQFvNUAb5',
    'H1bSKJxoxzxYRCdGQutVqFGeW7xU3AcN6vyEdZBU7Qb1rsZ',
    'Ea34UVcfamiLCFSRXD1bc4HRbZzsoo8RsTfKj2cDtf8GUdZ',
    'H4XB5xxo1YhDmBf3fVnobqDJPnEuF1m2GTctdkiXSPNchy5',
    'HnccMvwD4zsrG2mdyyiZvNCvDgMPZKrMA4BGHkT17c3KfkP',
    'EB1oqZ5MEnEwxhJ5DySCH3pyY55a2CUDfAbYKmLz2QcqWgx',
    'ERyyXEbUDa5AEMqY8dM7Nrtt6WY4BEAb65y1nbCmgE3rtQi',
    'FLPSoZhUwJwZvGwihQbrnF7aNYP62GaNKmDKDoiVZFe3TaQ',
    'HRL2QctmfjgFPLCSaiDJThYShQy7V4KvJqLWCY6pga6AEnE',
    'Gskn3eRyr3tDiKxhzU1MPG4ha8RFTBG9ft3C6Rrn3kGJMXn',
    'EB1oqZ5MEnEwxhJ5DySCH3pyY55a2CUDfAbYKmLz2QcqWgx',
    'Eki6rrJtqfF5RA7gshbe9twhL3umQRebqdWxRkUoLRtofHv',
    'DFxLeonhy3wNSDPVh5uqyai31vsMp2rY7SSJiM7dK6WQSgn'
    // 'HtRTwHSP6fYC5PtCsJ7pG4H1hwyPhzXbtVTTVRJ6kvfPFe1', did not set identity
    // 'Cu7QaEnRGPE91WvLduzUii2ZNa3jhMWtmB8SYwumycNRmoN' did not set identity
  ];

  get defaultSpotlightMetaImage(): string {
    const url = new URL(window.location.href)
    return (
      `${url.protocol}//${url.hostname}/kodadot_rank.jpg`
    )
  }
}
</script>

<template>
  <section>
    <br>
    <b-tabs
      v-model="activeTab"
      destroy-on-hide
      expanded
    >
      <b-tab-item
        v-for="x in components"
        :key="x"
        :label="x"
      >
        <component :is="x" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
const Collection = () => import('@/components/rmrk/Create/Create.vue')
const NFT = () => import('@/components/rmrk/Create/CreateToken.vue')

const components = { Collection, NFT }

@Component({ components })

export default class Remark extends Vue {
  public activeTab = 0
  public components: string[] = ['Collection', 'NFT']

  head() {
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'KodaDot | MINT',
        },
        { property: 'og:url', content: 'https://nft.kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting',
        },
        {
          property: 'og:image',
          content: '',
        },
        {
          property: 'twitter:title',
          content: 'Low fees and low carbon minting',
        },
        {
          property: 'twitter:description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
        {
          property: 'twitter:image',
          content: '/kodadot_mint.png',
        },
      ],
    }
  }

  layout() {
    return 'centered-half-layout'
  }
}
</script>

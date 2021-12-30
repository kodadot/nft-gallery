<template>
  <div class="columns">
    <div class="column is-6 is-offset-3">
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
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
const Collection = () => import('@/components/unique/Create/Create.vue')
const NFT = () => import('@/components/unique/Create/CreateToken.vue')

const components = { Collection, NFT }

@Component<Remark>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot | Low fees and low carbon minting'
        },
        { property: 'og:url', content: 'https://nft.kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Create carbonless NFTs with low on-chain fees'
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'og:image',
          content: this.defaultCreateMetaImage
        },
        {
          property: 'twitter:title',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'twitter:description',
          content: 'Create carbonless NFTs with low on-chain fees'
        },
        {
          property: 'twitter:image',
          content: this.defaultCreateMetaImage
        }
      ]
    }
  },
  components
})

export default class Remark extends Vue {
  public activeTab = 0
  public components: string[] = ['Collection', 'NFT']
  get defaultCreateMetaImage(): string {
    const url = new URL(window.location.href)
    return (
      `${url.protocol}//${url.hostname}/kodadot_mint.png`
    )
  }
}
</script>

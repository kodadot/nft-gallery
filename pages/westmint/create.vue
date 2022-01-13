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
  components,
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/westmint/create',
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  }
})

export default class Remark extends Vue {
  public activeTab = 0
  public components: string[] = ['Collection', 'NFT']
}
</script>

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
  public activeTab = 0;
  public components: string[] = ['Collection', 'NFT']

  layout() {
    return 'centered-half-layout'
  }
}
</script>

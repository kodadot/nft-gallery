<template>
  <div>
    <template v-if="items && !horizontalLayout">
      <Layout />
    </template>
    <div class="columns is-multiline">
      <div
        :class="`column ${classLayout}`"
        v-for="nft in items"
        :key="nft.id"
      >
        <GalleryCard
          :id="nft.id"
          :name="nft.name"
          :type="type"
          :link="link"
          :metadata="nft.metadata"
          :price="nft.price"
          :emoteCount="nft.emoteCount"
          :currentOwner="nft.currentOwner"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'

const components = {
  GalleryCard: () => import('./GalleryCard.vue'),
  Layout: () => import('./Layout.vue'),
}

@Component({ components })
export default class GalleryCardList extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string
  @Prop({ default: 'rmrk/detail' }) public link!: string
  @Prop() public items!: RmrkType[]
  @Prop({ default: false }) public horizontalLayout!: boolean
  get classLayout() {
    return this.$store.getters.getLayoutClass
  }
}

</script>
<style>
.b-radio.radio.button.is-selected{
  background-color: #db2980;
}
</style>

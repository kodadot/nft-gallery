<template>
  <div class="columns is-multiline">
    <div
      v-for="nft in items"
      :key="nft.id"
      class="column is-one-third-desktop is-one-third-tablet"
    >
      <GalleryCard
        :id="nft.id"
        :name="nft.name"
        :type="type"
        :link="link"
        :metadata="nft.metadata"
        :price="nft.price"
        :emote-count="nft.emoteCount"
        :current-owner="nft.currentOwner"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'

const components = {
  GalleryCard: () => import('./GalleryCard.vue')
}

@Component({ components })
export default class GalleryCardList extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public items!: RmrkType[];
}
</script>

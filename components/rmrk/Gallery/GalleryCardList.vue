<template>
  <div>
    <template v-if="items && !horizontalLayout">
      <Layout />
    </template>
    <div class="columns is-multiline">
      <div :class="`column ${classLayout}`" v-for="nft in items" :key="nft.id">
        <GalleryCard
          :id="nft.id"
          :name="nft.name"
          :route="route"
          :link="link"
          :metadata="metadataOf(nft)"
          :price="nft.price"
          :emoteCount="nft.emoteCount"
          :currentOwner="nft.currentOwner"
          :listed="listed"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { RmrkType } from '@/components/rmrk/service/scheme';

const components = {
  GalleryCard: () => import('./GalleryCard.vue'),
  Layout: () => import('./Layout.vue'),
};

@Component({ components })
export default class GalleryCardList extends Vue {
  @Prop({ default: '/rmrk/gallery' }) public route!: string;
  @Prop({ default: 'rmrk/gallery' }) public link!: string;
  @Prop() public items!: RmrkType[];
  @Prop(Boolean) public horizontalLayout!: boolean;
  @Prop(Boolean) public listed!: boolean;

  get classLayout() {
    return this.$store.getters['preferences/getLayoutClass'];
  }

  protected metadataOf(nft: any) {
    return nft.metadata || nft.collection?.metadata;
  }
}
</script>
<style>
/* TODO: move to global */
.b-radio.radio.button.is-selected {
  background-color: #db2980;
}
</style>

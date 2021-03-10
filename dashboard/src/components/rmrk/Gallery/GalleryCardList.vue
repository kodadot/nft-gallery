<template>
  <div class="columns is-multiline">
    <div
      class="column is-one-quarter-desktop is-one-third-tablet"
      v-for="nft in items"
      :key="nft.id"
    >
      <GalleryCard :id="nft.id" :name="nft.name" :image="nft.image" :type="type" :link="link" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import GalleryCard from './GalleryCard.vue';
import { RmrkType } from '@/components/rmrk/service/RmrkService';

const components = { GalleryCard };

@Component({ components })
export default class GalleryCardList extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public items!: RmrkType[];
}
</script>

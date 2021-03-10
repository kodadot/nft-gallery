<template>
  <div class="card nft-card">
    <LinkResolver class="nft-card__skeleton" :route="type" :param="id" :link="link" tag="div" >
      <div class="card-image" v-if="image">
        <b-image
          :src="image"
          :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
          alt="Simple image"
          ratio="1by1"
        ></b-image>
      </div>

      <div v-else class="card-image">
        <b-image
          :src="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
          alt="Simple image"
          ratio="1by1"
        ></b-image>
      </div>

      <div class="card-content">
        <p class="title is-4 has-text-centered has-text-primary">
          {{ name }}
        </p>
      </div>
    
    </LinkResolver>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';

const components = {
  LinkResolver: () => import('@/components/shared/LinkResolver.vue')
}

@Component({ components })
export default class GalleryCard extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public id!: string;
  @Prop() public name!: string;
  @Prop() public image!: string;
}
</script>

<style scoped>
.card.nft-card {
  padding: 1em !important;
  height: 100%;
}
.nft-card__skeleton {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

a {
  color: grey;
}
</style>

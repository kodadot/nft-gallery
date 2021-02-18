<template>
  <div class="card nft-card">
    <router-link
      :to="{ name: type, params: { id: id } }"
      tag="div"
      class="nft-card__skeleton"
    >
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
        <p class="title is-4">
          <router-link :to="{ name: type, params: { id: id } }">{{
            name
          }}</router-link>
        </p>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class GalleryCard extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
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

a:hover {
  color: black;
}
</style>

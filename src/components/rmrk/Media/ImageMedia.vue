<template>
  <figure class="image is-square nft-image">
    <img class="image-media__image" :src="src" :alt="mimeType" />
  </figure>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class ImageMedia extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

<style>
  figure > img.image-media__image {
    object-fit: cover;
  }
</style>

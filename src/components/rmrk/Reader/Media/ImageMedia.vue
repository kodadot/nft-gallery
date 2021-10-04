<template>
  <figure class="image is-1by1 nft-image">
    <img :src="src" :alt="mimeType" />
  </figure>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class ImageMedia extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

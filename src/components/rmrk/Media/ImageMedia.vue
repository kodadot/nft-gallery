<template>
  <b-image
    :src="src"
    :alt="mimeType"
    class="nft-image"
  ></b-image>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class ImageMedia extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

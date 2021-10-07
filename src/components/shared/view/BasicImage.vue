<template>
  <b-image
    :src="src"
    src-fallback="/placeholder.svg'"
    alt="KodaDot NFT minted multimedia"
    ratio="1by1"
    @error="onImageError"
    :class="customClass"
  >
    <template #placeholder>
      <b-skeleton class="skeleton-placeholder" height="100%"></b-skeleton>
    </template>
  </b-image>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BasicImage extends Vue {
  @Prop({ type: String, required: true }) public src!: string;
  @Prop(String) public customClass!: string;
  @Prop({ type: String, default: 'KodaDot NFT minted multimedia' }) public alt!: string;

  public onImageError(event: unknown): void {
    console.log('Unable to load ', this.src , event)
  }

}
</script>

<style scoped>
 .b-skeleton {
    height: 100%;
    position: absolute;
    top: 0;
}
</style>

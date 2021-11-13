<template>
  <b-image
    :src="src"
    src-fallback="/placeholder.svg"
    :alt="alt"
    ratio="1by1"
    @error="onImageError"
    :class="customClass"
    :rounded="rounded"
  >
    <template #placeholder>
      <b-skeleton class="skeleton-placeholder" :circle="rounded" height="100%"></b-skeleton>
    </template>
  </b-image>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BasicImage extends Vue {
  @Prop({ type: String }) public src!: string;
  @Prop(String) public customClass!: string;
  @Prop({ type: String, default: 'KodaDot NFT minted multimedia' }) public alt!: string;
  @Prop(Boolean) public rounded!: boolean;

  public onImageError(event: unknown, src: string): void {
    console.log('Unable to load ', src)
  }

}
</script>

<style scoped>
.b-skeleton {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

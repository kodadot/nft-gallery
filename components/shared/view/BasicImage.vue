<template>
  <b-image
    :src="src"
    src-fallback="/placeholder.svg"
    :alt="alt"
    ratio="1by1"
    :class="customClass"
    :rounded="rounded"
    @error="onImageError"
  >
    <template #placeholder>
      <b-skeleton
        class="skeleton-placeholder"
        height="100%"
        :circle="rounded"
      />
    </template>
  </b-image>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BasicImage extends Vue {
  @Prop({ type: String }) public src!: string
  @Prop(String) public customClass!: string
  @Prop({ type: String, default: 'KodaDot NFT minted multimedia' }) public alt!: string
  @Prop(Boolean) public rounded!: boolean

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

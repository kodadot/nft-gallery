<template>
  <object
    class="iframe-model__wrapper"
    :type="mimeType"
    :data="src"
  />
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component({})
export default class ImageMedia extends Vue {
  @Prop() public src!: string
  @Prop() public mimeType!: string
}
</script>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>

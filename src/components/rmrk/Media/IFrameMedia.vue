<template>

    <iframe class="iframe-model__wrapper" :src="src" :alt="mimeType" />
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class ImageMedia extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>

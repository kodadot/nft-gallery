<template>
  <b-image
    :src="src"
    :alt="mimeType"
    ratio="1by1"
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

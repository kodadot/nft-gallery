<template>
  <div>
    <a :href="src" target="_blank">Unknown animated media, click to download</a>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class Unknown extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

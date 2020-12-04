<template>
  <a-box :position="position" :src="src">
    <template>
      <a-text :position="at(-1)" :value="name"></a-text>
      <a-text :position="at(-1.5)" :value="sn"></a-text>
      <a-text :position="at(-2)" :value="artist"></a-text>
    </template>
  </a-box>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class NFT extends Vue {
  @Prop() public index!: string | number;
  @Prop() public src!: string;
  @Prop() public name!: string;
  @Prop() public sn!: string;
  @Prop() public artist!: string;

  get position(): string {
    return `${this.index} 3 0`;
  }

  private at(y: number, x = -1) {
    return `${x} ${y} 0`;
  }
}
</script>

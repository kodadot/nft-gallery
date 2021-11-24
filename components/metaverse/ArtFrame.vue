<template>
  <a-box color="tomato" depth="2" height="4" width="0.5">

  </a-box>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import * as THREE from 'three'

@Component({})
export default class ArtFrame extends Vue {
  @Prop() public position!: any;
  @Prop() public rotation!: any;
  @Prop() public src!: string;
}
</script>

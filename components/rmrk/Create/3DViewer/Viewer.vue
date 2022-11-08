<template>
  <div id="container" class="container"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Viewer } from './viewer'

@Component
export default class Viewer extends Vue {
  private viewer

  @Prop(String) public url!: string

  mounted() {
    console.log('ViewPort mounted')
    this.viewer = new Viewer(document.getElementById('container'))
    this.viewer.load(this.url)
  }
}
</script>

<style scoped>
.container {
  width: 250px;
  height: 250px;
}
</style>

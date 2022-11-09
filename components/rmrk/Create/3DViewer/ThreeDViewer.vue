<template>
  <div id="container" class="container"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Viewer } from './viewer'

@Component
export default class ThreeDViewer extends Vue {
  private viewer

  @Prop(String) public url!: string

  mounted() {
    this.viewer = new Viewer(
      document.getElementById('container') as HTMLElement
    )
    this.viewer.load(this.url)
  }

  @Watch('url')
  private onUrlChange() {
    this.viewer.load(this.url)
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 250px;
  height: auto;
  background: #ffffff;
  background: -webkit-radial-gradient(center, #ffffff, #353535);
  background: -moz-radial-gradient(center, #ffffff, #353535);
  background: radial-gradient(ellipse at center, #ffffff, #353535);
}
</style>

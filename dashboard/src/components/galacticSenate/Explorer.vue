<template>
  <div>
    <div id="myEmbeddedScene">
      <a-scene
        renderer="colorManagement: true;"
        vr-mode-ui="enterVRButton: #myEnterVRButton; enterARButton: #myEnterARButton">
        
        <!-- <a-box position="-1 0.9 -3" rotation="0 45 0" color="#4CC3D9"></a-box> -->
        
        <a-box position="0 0 -4" color="#e6007a" depth="0.5" height="0.5" width="0.5">
          <a-text position="0.5 0 0" value="0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952"></a-text>
        </a-box>
        <!-- <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere> -->
        <!-- <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> -->
        <!-- <a-icosahedron position="0 0 -4" color="#FFF" width="1" height="1" radius="1"></a-icosahedron> -->
        <!-- <a-plane position="0 1 -4" rotation="0 0 0" width="3" height="3" color="#7BC8A4"></a-plane> -->
        <!-- <a-entity position="0 2 -4" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <!-- <a-entity geometry="primitive: box; width: 1; height: 1; depth: 1" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <a-entity camera look-controls wasd-controls="acceleration:100; fly:true" position="0 0 0"></a-entity>

        <!-- sky should be disabled while in AR mode -->
        <a-sky color="#707070"></a-sky>
        
        <b-button class="enterButton" size="large" id="myEnterVRButton" href="#">VR</b-button>
        <b-button class="enterButton" size="large" id="myEnterARButton" href="#">AR</b-button>        
      </a-scene>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import aframe from 'aframe';

@Component({
  components: {},
})
export default class Explorer extends Vue {
  public loadedSummary: boolean = false;
  public activeTab: number = 0;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private blockHash: any = ''

  public async loadExternalInfo() {}

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }

}
</script>
<style scoped>
a-scene {
  height: 500px;
  width: 700px;
  /* z-index: -2; */
}
.enterButton {
  z-index: 1;
}
</style>

<template>
  <div>
    <div id="myEmbeddedScene">
      <a-scene
        renderer="colorManagement: true;"
        vr-mode-ui="enterVRButton: #myEnterVRButton; enterARButton: #myEnterARButton">
        
        <!-- <a-box position="-1 0.9 -3" rotation="0 45 0" color="#4CC3D9"></a-box> -->
        <!-- ${b.number.substring(8,9) - 4} -->
        <a-box 
          v-for="b in newHeads" 
          :key="b.stateRoot.toString()"
          :position="`0 0 ${defaultYBlock - b.number.toString()}`" color="#e6007a" depth="0.5" height="0.5" width="0.5">
          <a-text position="0.5 0 0" :value="b.parentHash"></a-text>
          <a-text position="-1.5 0 0" :value="b.number"></a-text>
        </a-box>
        <!-- <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere> -->
        <!-- <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> -->
        <!-- <a-icosahedron position="0 0 -4" color="#FFF" width="1" height="1" radius="1"></a-icosahedron> -->
        <!-- <a-plane position="0 1 -4" rotation="0 0 0" width="3" height="3" color="#7BC8A4"></a-plane> -->
        <!-- <a-entity position="0 2 -4" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <!-- <a-entity geometry="primitive: box; width: 1; height: 1; depth: 1" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <a-entity camera look-controls wasd-controls="acceleration:100; fly:true" position="0 1 0"></a-entity>

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
import Connector from '@vue-polkadot/vue-api';
import Router from 'vue-router';
import aframe from 'aframe';

@Component({
  components: {},
})
export default class Galactic extends Vue {
  public loadedSummary: boolean = false;
  public activeTab: number = 0;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private blockHash: any = '';
  private newHeads: any = [];
  private defaultYBlock: any;

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.subscribeNewHeads((value: any) => {
    console.log('Galactic -> loadExternalInfo -> value', value);
    if (!this.defaultYBlock) {
      this.defaultYBlock = value.number.toString()
    }
    console.log('Galactic -> loadExternalInfo -> value.number.toString()', value.number.toString());
      this.newHeads.unshift(value)
      if (this.newHeads.length > 25) {
        this.newHeads.pop()
      }
    }));
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }
  public blocks: any = [
    {
      number: '2,801,234',
      hash: '0xc8ffd8686820a51208032e806f7a2cdb5789190958dbfd003928a4bfbd071411',
    },
    {
      number: '2,801,235',
      hash: '0xfc2389cb7fb3b31dda110f571777b54a01e6406b3ad5c9594a54c3b56d6c6ec4',
    },
    {
      number: '2,801,236',
      hash: '0x409876dc416b95f0fc7dc4f361338179e281915e2d931de3805d50f2118df4fe',
    },
    {
      number: '2,801,237',
      hash: '0xfdd12038b84b147f7180e48ee98de74e9911008232513dccb43f587b7a17dcb3',
    },
    {
      number: '2,801,238',
      hash: '0x645796b1606713b1f5cdf4fc30c1f023b72c7194c83f7a4379ce334ce7192d46',
    },
    {
      number: '2,801,239',
      hash: '0x244d6b42efa00e9ef4384629695c7a7387ca2b4713973990c84cb1368c619d85',
    }
  ]
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

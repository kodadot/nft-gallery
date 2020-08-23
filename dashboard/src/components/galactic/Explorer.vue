<template>
  <div>
    <div id="myEmbeddedScene">
      <a-scene
        renderer="colorManagement: true;"
        vr-mode-ui="enterVRButton: #myEnterVRButton; enterARButton: #myEnterARButton">
        
        <a-box position="0 0 -3" depth="0.5" height="0.5" width="0.5" color="#e6007a"></a-box>
        <a-box position="0 0 -2" depth="0.5" height="0.5" width="0.5" color="#e6007a"></a-box>
        <a-box position="0 0 -1" depth="0.5" height="0.5" width="0.5" color="#e6007a"></a-box>
        <a-entity id="box" 
          position="1 1 -3" cursor-listener geometry="primitive: box" material="color: blue">
        </a-entity>

        <!-- snap this to camera, like HUD -->
        <!-- <a-text position="-1 1 -10" :value="`Best Block ${blockNumber}`"></a-text>   -->
        
        <a-box
          v-for="b in newHeads" 
          :key="b.stateRoot.toString()"
          :position="`0 0 ${defaultYBlock - b.number.toString()}`" color="#e6007a" depth="0.5" height="0.5" width="0.5">
          <a-text position="0.5 0 0" :value="b.parentHash.toString()"></a-text>
          <a-text position="-1.5 0 0" :value="b.number"></a-text>
          <a-text position="0 0.5 0" :value="b.extrinsicsRoot.toString()"></a-text>
        </a-box>
        <!-- <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere> -->
        <!-- <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> -->
        <!-- <a-icosahedron position="0 0 -4" color="#FFF" width="1" height="1" radius="1"></a-icosahedron> -->
        <!-- <a-plane position="0 1 -4" rotation="0 0 0" width="3" height="3" color="#7BC8A4"></a-plane> -->
        <!-- <a-entity position="0 2 -4" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <!-- <a-entity geometry="primitive: box; width: 1; height: 1; depth: 1" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity> -->
        <a-entity camera look-controls wasd-controls="acceleration:100; fly:true" position="0 1 0">
          <a-entity cursor="fuse: true; fuseTimeout: 500"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: black; shader: flat">
          </a-entity>
        </a-entity>

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
  private blockNumber: any;

  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.subscribeNewHeads((value: any) => {
    console.log('Galactic -> loadExternalInfo -> value', value);
    this.blockNumber = value.number.toString();
    if (!this.defaultYBlock) {
      this.defaultYBlock = value.number.toString();
    }
    console.log('Galactic -> loadExternalInfo -> value.number.toString()', value.number.toString());
      this.newHeads.unshift(value)
      // if (this.newHeads.length > 25) {
      //   this.newHeads.pop()
      // }
    }));
  }

  // public async registerClick() {
  //   AFRAME.registerComponent('cursor-listener', {
  //     init() {
  //       let lastIndex = -1;
  //       const COLORS = ['red', 'green', 'blue'];
  //       this.el.addEventListener('click', function (evt) {
  //         lastIndex = (lastIndex + 1) % COLORS.length;
  //         this.setAttribute('material', 'color', COLORS[lastIndex]);
  //         console.log('I was clicked at: ', evt.detail.intersection.point);
  //       });
  //     }
  //   });
  // }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
    // this.registerClick()
  }
  
  public blocks: any = [
    {
      number: '2804637',
      hash: '0x1308a1d8402be3e7d2f29eb82da3a668094c4166daa1fd50285960f67d5057c8',
    },
    {
      number: '2804636',
      hash: '0x074a3be3fe7e96d78d23370a8b3e1feaf8bb7e921f7178662c2aea7bf4498939',
    },
    {
      number: '2804635',
      hash: '0x6bceacbd1a4e23c1887f4d8482ef33b25cf0c312e7fa1101471ee4de0f3f1b8d',
    },
    {
      number: '2804634',
      hash: '0x42cbae25ed025514eac5c0ffb44e30d8af0cebb522bed5fb1d40c4f71e888387',
    },
    {
      number: '2804633',
      hash: '0x873604e9a67027812c4d05170cffb7e83733f015c93eec339791121e6b92ed34',
    },
    {
      number: '2804632',
      hash: '0x4234c40bec30637a3f9b51e7cbe2464760f37d73b6f0b0a2703504db978807cb',
    },
    {
      number: '2804631',
      hash: '0x8ba5ca20b894091df0caeef6a0fb40196ee6f3d0275f0723f2fc8d16aba4e1a4',
    },
    {
      number: '2804630',
      hash: '0x9ec2bc049d94126b807ed211d9ac40360f17376e4d9b7b149de44f017837b106',
    },
    {
      number: '2804629',
      hash: '0xdf9ecb43aeabec193e336cd14d6097a360d8cbd1c4fc850d265b83d7db13c8f2',
    },
    {
      number: '2804628',
      hash: '0xf174637530d3152426cacd15daf349c9b7ce885722b2cfd6edad9fd2c25a9d80',
    },
    {
      number: '2804627',
      hash: '0xa55456157d5bfd783fb1a34941c01031d3dc22bdea4b996074f42259cc0499b0',
    },
    {
      number: '2804626',
      hash: '0xf0a74abd37616477520c66cbb811b0403b4d349d32781b1f56e45a7eb141dd04',
    },
    {
      number: '2804625',
      hash: '0x64e142971480abc628850d5a773692eaf295394c24c6ab6eeb792d35039e3199',
    },
    {
      number: '2804624',
      hash: '0xe43909ac996444c0599a3917e4cb8daafd1f2a828de03e121ffa4ef2ee121ef7',
    },
    {
      number: '2804623',
      hash: '0x923f189f02f3bfecb0f93d4bc811527277fdc0a7b0486314fdec9082fce7c6c4',
    },
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

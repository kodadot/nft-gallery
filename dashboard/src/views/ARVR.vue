
<template>
  <div>
    <div id="myEmbeddedScene">
      <a-scene
        renderer="colorManagement: true;"
        vr-mode-ui="enterVRButton: #myEnterVRButton; enterARButton: #myEnterARButton">
        
        
        <nft :index="0" src="https://ipfs.io/ipfs/QmUzAU6QKC6JaEmUvry3sF3VX8jpzRgMdo4itvjJUKeZdY" name="Kusama Cube" sn="0000000000000001" artist="obxium" />
        <nft :index="2.5" src="https://ipfs.io/ipfs/QmYtRcHi9VKroQ8JeNR4a8uRJ2v2fiC9tB4VwMsWXeBATe" name="Kusama Tetrahedron" sn="0000000000000002" artist="obxium" />
        <nft :index="5" src="https://ipfs.io/ipfs/QmScrBJ95rbLUqTMcbuG9X1VDw9wiwG9cwfGCop44LFgR4" name="Kusama Dodecahedron" sn="0000000000000003" artist="obxium" />
        <nft :index="7.5" src="https://ipfs.io/ipfs/QmVD6suzG7rHLTkcFqf5GtBjWCg1sSR1wkALrsXaP4emfK" name="Kusama Octahedron" sn="0000000000000004" artist="obxium" />
        <nft :index="10" src="https://ipfs.io/ipfs/QmeMVoFhNsJ7x8ezSTLPStDruGUkvB8tRRmJXeFRRpQSgt" name="Kusama Icosahedron" sn="0000000000000005" artist="obxium" />


        <a-entity camera look-controls wasd-controls="acceleration:100; fly:true" position="5 1 10">
          <a-cursor raycaster="objects: .link"></a-cursor>
        </a-entity>

        

        <!-- sky should be disabled while in AR mode -->
        <a-sky color="#707070"
          opacity="0"
        ></a-sky>
        
        <b-button class="enterButton" size="large" id="myEnterVRButton" href="#">VR</b-button>
        <b-button class="enterButton" size="large" id="myEnterARButton" href="#">AR</b-button>        
      </a-scene>
    </div>
  </div>
</template>


<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import NFT from '@/components/arvr/NFT.vue'
import 'aframe';

@Component({
  components: {
    nft: NFT
  }
})
export default class ARVR extends Vue {
  private visible: boolean = true;
  @Prop() public value!: any; 

  public mounted() {
    AFRAME.registerComponent('toggle-info', {
      schema: {type: 'string'},
      init() {
        // this.el.addEventListener('click', (evt) => {
        //   console.log('I was clicked at: ', (evt as any).detail.intersection.point)
        // })
      },

    })
  }

  public handleClick(event: any) {
    console.log(event)
    this.visible = !this.visible
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

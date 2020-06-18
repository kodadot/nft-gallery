<template>
  <div>
    <a-scene
      vr-mode-ui="enabled: true">
      <a-box position="-1 0.9 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <!-- <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere> -->
      <!-- <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> -->
      <a-icosahedron position="0 3 -4" color="#FFF" width="1" height="1" radius="1"></a-icosahedron>
      <a-plane position="0 2 -4" rotation="0 0 0" width="3" height="3" color="#7BC8A4"></a-plane>
      <a-entity position="0 2 -4" text="value: 0x84ac5959d475099861cc0e286cc7f323f6e5cda92d492a5773e128af9b5f0952;"></a-entity>
      <a-entity camera look-controls wasd-controls="acceleration:100; fly:true" position="0 1.6 0"></a-entity>
      <!-- <a-entity laser-controls="hand: left"></a-entity> -->
      <a-entity laser-controls line="color: red; opacity: 0.75"></a-entity>
      <a-sky color="#707070"></a-sky>
      
    </a-scene>
    <!-- <b-tabs v-model="activeTab" @input="tabClick" :multiline="true">
      <b-tab-item label="⛓ Chain">
        <b-progress v-if="!loadedSummary"
        size="is-large" 
        type="is-primary" 
        show-value>Fetching data</b-progress>
        <Summary @loaded="summaryIsLoaded" />
      </b-tab-item>
      <b-tab-item label="🔍 Block">
				<BlockDetails 
          :chainName="chainName.toString()"
					:lastBlock="currentBlock.toString()"
          :queryBlock="$route.params.hash" />
      </b-tab-item>
      <b-tab-item label="👁 Node">
        <NodeDetails />
      </b-tab-item>
      <b-tab-item label="🔬 Verbose">
        <NodeVerbose />
      </b-tab-item>
    </b-tabs> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import aframe from 'aframe';
// import Connector from '@vue-polkadot/vue-api';
// import BlockDetails from './BlockDetails.vue';
// import Summary from './Summary.vue';
// import NodeDetails from './NodeDetails.vue';
// import NodeVerbose from './NodeVerbose.vue';

@Component({
  components: {
    
    
  },
})
export default class Explorer extends Vue {
  public loadedSummary: boolean = false;
  public activeTab: number = 0;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private blockHash: any = ''

  public async loadExternalInfo() {
    // const { api } = Connector.getInstance();
    // this.subs.push(await api.derive.chain.bestNumberFinalized((value: any) => this.currentBlock = value.toString()));
    // this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value.toString()));
  }
  
  // @Watch('$route.params.tab')
  // public async reflect() {
  //   if (typeof this.$route.params.tab === 'number') {
  //     this.activeTab = Number(this.$route.params.tab);
  //   }
  // }
  
  // public summaryIsLoaded(): any {
  //   this.loadedSummary = true;
  // }

  // public async tabClick(): Promise<void> {
  //   this.$router.replace(`/galactic/${this.activeTab}`)
  //   if (this.activeTab === 1) {
  //     const { api } = Connector.getInstance();
  //     this.subs.push(this.blockHash = await api.rpc.chain.getBlockHash((this.currentBlock)));
  //     this.$router.replace(`/galactic/${this.activeTab}/${this.blockHash}`)
  //   }
  // }

  public async mounted(): Promise<void> {
    // this.reflect();
    this.loadExternalInfo();
  }

  // public beforeDestroy() {
  //   this.subs.forEach((sub) => sub());
  // }
}
</script>

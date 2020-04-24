<template>
  <div>
		<b-field label="Total Peers">
			<b-input :value="totalPeers" disabled></b-input>
		</b-field>
		<b-field label="is Syncing">
			<b-input :value="isSyncing" disabled></b-input>
		</b-field>
		<b-field label="Our Best Block">
			<b-input :value="ourBest" disabled></b-input>
		</b-field>
		<b-field label="Peer Best Block">
			<b-input :value="ourBest" disabled></b-input>
		</b-field>
		
    <!-- peer best 
    <p v-if="bestPeer"> {{bestPeer.bestNumber}}</p>
    Queued tx {{nodeInfo.extrinsics.length}} -->
    <!-- [[connected peers]] -->
    <!-- should be separate component -->
    <!-- <p>Peers {{nodeInfo.peers}}</p> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Card from '../shared/Card.vue';

@Component({
  components: {
    Card,
  },
})
export default class NodeDetails extends Vue {
	@Prop() public totalPeers!: string;
  @Prop() public isSyncing!: string;
  @Prop() public ourBest!: string;
  @Prop() public peerBest!: string;
	
}
</script>

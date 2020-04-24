<template>
  <div>
		<b-field label="Total Peers">
			<b-input :value="peers.length" disabled></b-input>
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
    <!-- {{ peers }} -->
    <!-- <div class="columns">
      <div class="column is-full-mobile"> -->
    <Table :data="peers" :columns="cols" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import Router from 'vue-router';
import Card from '../shared/Card.vue';
import Table from '@/components/shared/Table.vue';

@Component({
  components: {
    Card,
    Table,
  },
})
export default class NodeDetails extends Vue {
	@Prop() public totalPeers!: string;
  @Prop() public isSyncing!: string;
  @Prop() public ourBest!: string;
  @Prop() public peerBest!: string;
  
  private peers: any[] = [];
  private cols: any = [
    { 
      field: 'peerId',
      label: 'peerId'    
    },
    { 
      field: 'roles',
      label: 'role'    
    },
    { 
      field: 'bestNumber',
      label: 'best #'    
    },
    { 
      field: 'bestHash',
      label: 'best hash',
      width: '10'
    }
  ]
  
  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.peers = await api.rpc.system.peers(); 
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }
}
</script>

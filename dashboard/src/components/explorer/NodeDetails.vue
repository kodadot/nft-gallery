<template>
  <div v-if="health && ourBestBlock">
		<b-field label="Total Peers">
			<b-input :value="peers.length" disabled></b-input>
		</b-field>
		<b-field label="Syncing">
			<b-input :value="health.isSyncing.toString()" disabled></b-input>
		</b-field>
		<b-field label="Our Best Block">
			<b-input :value="ourBestBlock.toString()" disabled></b-input>
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
  private health: any = '';
  private peers: any[] = [];
  private subs: any[] = [];
  private ourBestBlock: any = '';
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
    this.health = await api.rpc.system.health() 
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.ourBestBlock = value));
  }

  public async mounted(): Promise<void> {
    this.loadExternalInfo();
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>

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
    <b-button @click="refreshPeers" icon-left="sync">Refresh</b-button>
    <!-- {{ peersAdjusted }} -->
    <b-field grouped group-multiline>
      <div v-for="(column, index) in columns" 
        :key="index"
        class="control">
        <b-checkbox v-model="column.visible">
          {{ column.label }}
        </b-checkbox>
      </div>
    </b-field>  
    <b-table 
      :data="peers"
      :striped="true"
      default-sort="peers.roles">
      <template slot-scope="props">
        <b-table-column field="peerId" label="peerID" sortable :visible="columns.peerId.visible">
          {{ props.row.peerId }}
        </b-table-column>
        <b-table-column field="roles" label="roles" sortable :visible="columns.roles.visible">
          {{ props.row.roles }}
        </b-table-column>
        <b-table-column field="bestNumber" label="b #" sortable :visible="columns.bestBlock.visible">
          {{ props.row.bestNumber }}
        </b-table-column>
        <b-table-column field="bestHash" label="best hash" sortable :visible="columns.beshHash.visible">
          {{ props.row.bestHash }}
        </b-table-column>
      </template>
    </b-table>
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
  private peersAdjusted: any[] = [];
  private subs: any[] = [];
  private ourBestBlock: any = '';
  private columns: any = {
    peerId: { label: 'peerId', visible: true},
    roles: { label: 'roles', visible: true},
    bestBlock: { label: 'best block', visible: true},
    beshHash: { label: 'best hash', visible: false},
  }
  
  
  public async loadExternalInfo() {
    const { api } = Connector.getInstance();
    this.peers = await api.rpc.system.peers();
    this.health = await api.rpc.system.health() 
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.ourBestBlock = value));
  }

  public async refreshPeers() {
    const { api } = Connector.getInstance();
    this.peers = await api.rpc.system.peers();
    const arr = Object.entries(this.peers)

    const a: any[] = []
    for (const [key, value] of arr) {    
      a.push([key, (value as any)])
    }

    const m = new Map(a)
    
    for (const o of m) {
      this.peersAdjusted.push(o[1])
    }
    // console.log('NodeDetails -> refreshPeers -> a', a);

    
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

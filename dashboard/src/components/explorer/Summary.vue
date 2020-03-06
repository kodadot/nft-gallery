<template>
  <div id="summary">
    <!-- <b-field label="Best Block">
      <b-input :value="currentBlock" disabled></b-input>
    </b-field> -->
    {{ currentBlock }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';

@Component({})
export default class Summary extends Vue {
  private currentBlock: any = {};
  private subs: any[] = [];
  
  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumber((value:any) => this.currentBlock = value));
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}

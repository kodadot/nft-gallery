<template>
  <div class="NetworkVisualCue">
    <!-- #{{ currentBlock }}
    {{ chainName }} -->
    <span v-for="n in hyphenCustom" :key="n">
      <span>{{n}}<br></span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';


@Component({})
export default class NetworkVisualCue extends Vue {
  @Prop(String) public value!: string;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private hyphenCustom: any[] = [];

  @Watch('$store.getters.getSettings')
  public hyphenation(): void {
    this.hyphenCustom = Object.entries(this.$store.getters.getSettings);
    this.hyphenCustom = this.hyphenCustom[0][1].slice(6).split('.');
  }
  public async mounted() {
    this.hyphenation();
  //   const { api } = Connector.getInstance();
  //   this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value.toString()));
  //   this.subs.push(await api.rpc.system.chain((value: any) => this.chainName = value.toString()));
  }

  // public beforeDestroy() {
  //   this.subs.forEach((sub) => sub());
  // }
}
</script>

<style>
.NetworkVisualCue {
  color: #dbdbdb;
  font-size: 0.6em;
  hyphens: auto;
  padding-bottom: 1em;
}
</style>

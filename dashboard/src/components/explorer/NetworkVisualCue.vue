<template>
  <div class="NetworkVisualCue">
    <router-link :to="{name: 'settings'}"><span v-for="n in hyphenCustom" :key="n">
      <span>{{n}}<br></span>
    </span></router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Connector from '@vue-polkadot/vue-api';

const localhost: RegExp = /27\.0\.0\.1\:\d+/;

@Component({})
export default class NetworkVisualCue extends Vue {
  @Prop(String) public value!: string;
  private subs: any[] = [];
  private currentBlock: any = {};
  private chainName: any = {};
  private hyphenCustom: any[] = [];

  @Watch('$store.getters.getSettings')
  private hyphenation(): any {
    const destination: any = Object.entries(this.$store.getters.getSettings);
    const hyphenCheck = destination[0][1].slice(6)
    
    if (localhost.test(hyphenCheck)) {
      return this.hyphenCustom = ['l','o','c','a','1']
    }
    this.hyphenCustom = hyphenCheck.split('.');
  }
  public async mounted() {
    this.hyphenation();
  }
}
</script>

<style>
.NetworkVisualCue {
  color: #dbdbdb;
  font-size: 0.6em;
  hyphens: auto;
  padding-bottom: 1em;
}

.NetworkVisualCue a { 
  color: white;
}

.NetworkVisualCue a:hover {
  color: hotpink;
}
</style>

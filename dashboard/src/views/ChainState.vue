<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x" @click="handleWatch"></component>
      </b-tab-item>
    </b-tabs>
    <Argurments :args="random" disabled :defaultValues="defaultValues" />
    <Queries :values="mapValues" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import Storage from '@/components/storage/Storage.vue'
import Queries from '@/components/storage/Queries.vue'
import Argurments from '@/components/extrinsics/Arguments.vue';

const components = {
  Storage,
  Queries,
  Argurments
}

@Component({ components })
export default class ChainState extends Mixins(SubscribeMixin) {
  private activeTab: number = 0;
  private values: any = {};
  private list: any[] = [];
  private components: string[] = ['Storage']
  private random: any[] = [];
  private defaultValues: any[] = []

  get mapValues() {
    return this.list
  }

  private entryMapper([label, value]: [string, any]) {
    return { label, value }
  }

  private magic(key: any) {
    if (key in this.values) {
      throw EvalError(`${key} already subscribed`)
    }
    
    return (value: any) => {
      console.log(key, value)
      this.values[key] = value;
      this.list = Object.entries(this.values).map(this.entryMapper)
    };
  }

  private async useCall(callback: any, params: any) {
    const tx = await callback(...params);
    console.log('tx', tx, tx.toHuman());
  }

  private async handleWatch({ key, method, args }: any) {
    console.log('handleWatch', this.activeTab);
    this.random = [...this.random, key]
    const value = await method(...args);
    console.warn('[DEBUG] Chainstate got Value', value)
    this.defaultValues = [...this.defaultValues, value]
    // this.subscribe(method, args, this.magic(key));
    

  }
}
</script>

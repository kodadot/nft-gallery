<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x" @click="handleWatch"></component>
      </b-tab-item>
    </b-tabs>
    <Argurments
      :args="random"
      disabled
      :defaultValues="defaultValues"
      :actionVisible="true"
      @action="handleDeleteKey"
    />
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
export default class ChainState extends Vue {
  private activeTab: number = 0;
  private values: any = {};
  private keys: any = {};
  private components: string[] = ['Storage']
  private random: any[] = [];
  private defaultValues: any[] = [];
  private subs: any = {};

  private entryMapper([label, value]: [string, any]) {
    return { label, value }
  }

  private magic(key: any, length: number) {
    if (key in this.values) {
      throw EvalError(`${key} already subscribed`)
    }

    return (value: any) => {
      console.log(key, value)
      this.$set(this.defaultValues, length, value);
    };
  }

  private async useCall(callback: any, params: any) {
    const tx = await callback(...params);
    console.log('tx', tx, tx.toHuman());
  }

  private async handleWatch({ key, method, args }: any) {
    console.log('handleWatch', this.activeTab);
    const value = await method(...args);
    console.warn('[DEBUG] Chainstate got Value', value)
    this.defaultValues = [...this.defaultValues, value];
    (window as any).value = value;
    this.random = [...this.random, key];
    this.keys[key.name] = this.defaultValues.length - 1;
    this.subscribe(method, args, this.magic(key.name, this.keys[key.name]), key.name);
  }

  public async subscribe(fn: any, args: any, callback: any, key: any) {
    this.subs[key] = await fn(...args, callback);
  }

  public beforeDestroy() {
    Object.values(this.subs).forEach((sub: any) => sub());
  }

  public handleDeleteKey(key: any) {
    const index = this.keys[key];
    this.$delete(this.random, index);
    this.$delete(this.defaultValues, index);
    if (this.subs[key]) {
      this.subs[key]();
    }
    this.$delete(this.subs, key);
    this.$delete(this.keys, key);
    this.keys = Object.fromEntries(Object.entries(this.keys).map(([keyIndex, value]: [string, any]) => [keyIndex, value > index ? value - 1 : value]))
  }
}
</script>

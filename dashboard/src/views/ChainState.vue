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
import Constants from '@/components/storage/Constants.vue'
import Raw from '@/components/storage/Raw.vue'
import Queries from '@/components/storage/Queries.vue'
import Argurments from '@/components/extrinsics/Arguments.vue';
import isFunction from '@/utils/isFunction'

const components = {
  Storage,
  Queries,
  Argurments,
  Constants,
  Raw
}

@Component({ components })
export default class ChainState extends Vue {
  private activeTab: number = 0;
  private values: any = {};
  private keys: any = {};
  private components: string[] = ['Storage', 'Constants', 'Raw']
  private random: any[] = [];
  private defaultValues: any[] = [];
  private subs: any = {};

  private entryMapper([label, value]: [string, any]) {
    return { label, value }
  }

  private magic(key: any, length: number, unwrap: any) {
    return (value: any) => {
      const val = unwrap ? unwrap(value) : value
      console.log(key, value)
      this.$set(this.defaultValues, length, val);
    };
  }

  private async useCall(callback: any, params: any) {
    const tx = await callback(...params);
    console.log('tx', tx, tx.toHuman());
  }

  private async extractValue({ method, args, isConst, unwrap, valueMethod }: any) {
    if (isConst) {
      return method;
    }

    if (valueMethod) {
      if (unwrap) {
        return await valueMethod(...args).then(unwrap)
      }

      return await valueMethod(...args)
    }

    if (unwrap) {
      return await method(...args).then(unwrap)
    }

    return await method(...args)
  }

  private async handleWatch({ key, method, args, isConst, unwrap, valueMethod }: any) {
    try {
     if (key.name in this.keys) {
      throw EvalError(`${key.name} already subscribed`)
    }
    const value = await this.extractValue({ key, method, args, isConst, unwrap, valueMethod });
    this.defaultValues = [...this.defaultValues, value];
    this.random = [...this.random, key];
    this.keys[key.name] = this.defaultValues.length - 1;
    this.subscribe(method, key.name, args, this.magic(key.name, this.keys[key.name], unwrap), isConst);
    } catch (e) {
      console.warn(e.message)
    }
  }

  public async subscribe(fn: any, key: any, args: any, callback: any, isConst?: boolean) {
    if (isConst) {
      this.subs[key] = fn;
    } else {
      this.subs[key] = await fn(...args, callback);
    }
    
  }

  public beforeDestroy() {
    Object.values(this.subs).forEach((sub: any) => sub());
  }

  public handleDeleteKey(key: any) {
    const index = this.keys[key];
    this.$delete(this.random, index);
    this.$delete(this.defaultValues, index);
    
    if (this.subs[key] && isFunction(this.subs[key])) {
      this.subs[key]();
    }
    this.$delete(this.subs, key);
    this.$delete(this.keys, key);
    this.keys = Object.fromEntries(Object.entries(this.keys).map(([keyIndex, value]: [string, any]) => [keyIndex, value > index ? value - 1 : value]))
  }
}
</script>

<template>
  <div>
    <CallRPC @click="handleWatch" />
    <Argument
      v-for="(arg, index) in random"
      v-bind:key="index"
      :argument="arg"
      disabled
      :defaultValue="getDefaultValue(index)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import QueryMixin from '@/utils/mixins/queryMixin'
import CallRPC from './CallRPC.vue'
import Unknown from '@/params/components/Unknown.vue'

const components = { Argument: Unknown,  CallRPC }

@Component({ components })
export default class RPC extends Mixins(QueryMixin) {

    public getDefaultValue(index: number) {
    if (this.defaultValues) {
      try {
        return this.defaultValues[index].toJSON();
      } catch (e) {
        return this.defaultValues[index];
      }
    }
  }


}
</script>

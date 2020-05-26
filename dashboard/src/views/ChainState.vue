<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import Storage from '@/components/storage/Storage.vue'

const components = {
  Storage,
}

@Component({ components })
export default class ChainState extends Mixins(SubscribeMixin) {
  private activeTab: number = 0;
  private values: any[] = [];
  public components: string[] = ['Storage']


  private addToValue(callback: any) {
    this.values.push(callback)

    return callback
  }
}
</script>

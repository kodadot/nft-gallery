<template>
  <div>
    <b-button
      type="is-primary"
      icon-left="plus"
      class="treasury-button__submit"
    >
      New Tip
    </b-button>
    <div>
      <SectionTitle title="Tips" />
    </div>
    <EmptyGuard :array="hashes" label="Tips">
      <Tip v-for="hash in hashes" :key="hash" :hash="hash" />
    </EmptyGuard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import SectionTitle from '@/components/shared/SectionTitle.vue'
import Subscribe from '@/utils/mixins/subscribeMixin'
import Tip from './Tip.vue'
import EmptyGuard from '@/components/shared/wrapper/EmptyGuard.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    SectionTitle,
    Tip,
    EmptyGuard
  }
})
export default class Tips extends Mixins(Subscribe) {
  private info?: any = {};
  private hashes: any[] = [];

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subscribe(api.query.treasury.tips.keys, [], this.hashMapper)
  }

  private hashMapper(keys: any[]) {
    this.hashes = keys.map((key) => key.args[0].toHex())
  }

}
</script>


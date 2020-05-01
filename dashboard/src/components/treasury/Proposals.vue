<template>
  <div>Proposals</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Summary from './Summary.vue'

import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Summary
  }
})
export default class Proposals extends Vue {
  @Prop({default: []}) proposals: any[] = [];

}
</script>

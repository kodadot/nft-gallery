<template>
<div>
  <Proposal v-for="(proposal, index) in proposals" :key="index" :proposal="proposal" />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import Proposal from './Proposal.vue'
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Proposal
  }
})
export default class Proposals extends Vue {
  @Prop() proposals!: any[];

}
</script>

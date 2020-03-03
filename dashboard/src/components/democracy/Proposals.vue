<template>
    <div>
      <Proposal v-for="(proposal, index) in proposals" :key="index" :proposal="proposal" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Proposal from './Proposal.vue';

@Component({
  components: {
    Proposal,
  },
})
export default class Proposals extends Vue {
  private proposals: any[] = [];



  public mounted() {
    this.loadProposals();
  }

  public async loadProposals() {
    if ((this as any).$http.api) {
      const newProposals = await (this as any).$http.api.derive.democracy.proposals();
      this.proposals = newProposals;
      
    }
  }

}
</script>

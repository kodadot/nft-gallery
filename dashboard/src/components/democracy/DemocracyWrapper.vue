<template>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Democracy">
				<Summary />
				<b-tabs v-model="democracyTab">
					<b-tab-item label="Submit Proposal"><SubmitProposal /></b-tab-item>
					<b-tab-item label="Submit Preimage"><Preimage/></b-tab-item>
				</b-tabs>
     
      </b-tab-item>
      <b-tab-item label="Referendums"><Referendums/></b-tab-item>
      <b-tab-item label="Proposal"><Proposals/></b-tab-item>
    </b-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Democracy from './Democracy.vue';
import Referendums from './Referendums.vue';
import Proposals from './Proposals.vue';
import Summary from './Summary.vue';
import SubmitProposal from './SubmitProposal.vue';
import Extrinsics from '@/views/Extrinsics.vue';
import Preimage from './Preimage.vue';

@Component({
  components: {
    Democracy,
    Referendums,
    Proposals,
    Summary,
		SubmitProposal,
    Extrinsics,
    Preimage,
  },
})
export default class DemocracyWrapper extends Vue {
  public activeTab: number = 0;
  public democracyTab: number = 0;

}
</script>

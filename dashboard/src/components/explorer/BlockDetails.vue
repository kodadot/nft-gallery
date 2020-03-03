<template>
  <div id="blockdetails">
		<b-field label="Chain">
			<b-input :value="chainName" disabled></b-input>
		</b-field>
		<b-field label="Last block">
			<b-input :value="lastBlock" disabled></b-input>
		</b-field>
		<div class="columns">
			
			<div class="column is-6">
				extrinsics
				<Card nature='timestamp.set (#0)'
          natureDesc="Set the current time. This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time. The timestamp should be greater than the previous one by the amount specified by `MinimumPeriod`. The dispatch origin for this call must be `Inherent`."
          type="1581518316000"
          extrinsicHash="0x00781baf5287f2bc103dc76ced4ef768516730881afcd5e39605827afd868b88"
          lifetime="lifetime"
        />
			</div>
			<div class="column is-6">
				<h1>events</h1>
				<Card nature='system.ExtrinsicSuccess (#0)'
          natureDesc="Set the current time. This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time. The timestamp should be greater than the previous one by the amount specified by `MinimumPeriod`. The dispatch origin for this call must be `Inherent`."
          type="1581518316000"
          extrinsicHash="0x00781baf5287f2bc103dc76ced4ef768516730881afcd5e39605827afd868b88"
          lifetime="lifetime"
        />
				
				<!-- parentHash -><br>
        extrinsicsRoot -><br>
        StateRoot -><br>
        [extrinsics]<br>
        [events]<br>
        [logs]<br> -->
			</div>
		</div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Card from '../shared/Card.vue';

@Component({
  components: {
    Card,
  },
})
export default class BlockDetails extends Vue {
	@Prop(String) public lastBlock!: string;
	@Prop(String) public chainName!: string;
	public activeTab: number = 1;
	
}
</script>

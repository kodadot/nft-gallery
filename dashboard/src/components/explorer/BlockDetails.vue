<template>
  <div id="blockdetails">
    <DisabledInput label="Chain" :value="chainName" />
    <DisabledInput label="Best Block" :value="lastBlock" />
		<div class="columns">
			<div class="column is-6">
				extrinsics
				<Card nature='timestamp.set (#0)'
          natureDesc="Set the current time. This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time. The timestamp should be greater than the previous one by the amount specified by `MinimumPeriod`. The dispatch origin for this call must be `Inherent`."
          type="1581518316000"
          extrinsicHash="0x00781baf5287f2bc103dc76ced4ef768516730881afcd5e39605827afd868b88"
          lifetime="lifetime"
        />
        <Card nature='finalityTracker.finalHint (#1)'
          natureDesc="Hint that the author of this block thinks the best finalized block is the given number."
          type="1,290,492"
          extrinsicHash="0x0b69f087f6897616b50de535d3500e5bd7a4592b0a5a69e3019faf62bb49a769"
          lifetime="lifetime"
        />
        <Card nature='parachains.setHeads (#2)'
          natureDesc="Provide candidate receipts for parachains, in ascending order by id."
          type="1,290,492"
          extrinsicHash="0xcf52705d1ade64fc0b05859ac28358c0770a217dd76b75e586ae848c56ae810d"
          lifetime="immortal"
        />
			</div>
			<div class="column is-6">
				<h1>events</h1>
				<Card nature='system.ExtrinsicSuccess (#0)'
          natureDesc="An extrinsic completed successfully."
          type='"{"weight":10000,"class":"Operational","paysFee":true}"'
        />
				<Card nature='system.ExtrinsicSuccess (#1)'
          natureDesc="An extrinsic completed successfully."
          type='"{"weight":10000,"class":"Normal","paysFee":true}"'
        />
				<Card nature='system.ExtrinsicSuccess (#2)'
          natureDesc="An extrinsic completed successfully."
          type='"{"weight":1000000,"class":"Normal","paysFee":true}"'
        />
				
				<!-- parentHash -><br>
        extrinsicsRoot -><br>
        StateRoot -><br>
        [extrinsics]<br>
        [events]<br>
        [logs]<br> -->
			</div>
		</div>
		<div class="columns">
			<div class="column is-6">
				<h1>logs</h1>
				<Card nature='PreRuntime'
          type="u32 / BABE"
          extrinsicHash="0x02190000002c62ba0f00000000"
        />
				<Card nature='PreRuntime'
          type="u32 / BABE"
          extrinsicHash="0x8097df1f475eb592d58a9d054cc1786e…b1330519118975314eec48ef80"
        />
			</div>
		</div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Router from 'vue-router';
import Card from '../shared/Card.vue';
import DisabledInput from '@/components/shared/DisabledInput.vue';

@Component({
  components: {
    Card,
    DisabledInput,
  },
})
export default class BlockDetails extends Vue {
	@Prop(String) public lastBlock!: string;
	@Prop(String) public chainName!: string;
	public activeTab: number = 1;
	
}
</script>

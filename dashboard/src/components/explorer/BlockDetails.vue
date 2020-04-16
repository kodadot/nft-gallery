<template>
  <div id="blockdetails">
    <DisabledInput v-if="typeof chainName === 'string'" 
      label="Chain" :value="chainName" />
    <DisabledInput v-if="typeof lastBlock === 'string'" 
      label="Finalized Block" :value="lastBlock" />

    <SingleBlockDetail 
      :hash="queryBlock" 
      :open="true" />
    
    <div class="columns">
			<div class="column is-6">
				<b-field label="extrinsics"></b-field> 
        <SingleBlockExtrinsicsDetail 
          :hash="queryBlock"
          :open="true" />
			</div>
		</div>
    <div class="columns">
      <div class="column is-6">
				<b-field label="events"></b-field>
				<SingleBlockEventDetail 
          :hash="queryBlock" />
			</div>
    </div>
		<div class="columns">
			<div class="column is-6">
        <b-field label="logs"></b-field>
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
import SingleBlockDetail from './SingleBlockDetail.vue';
import SingleBlockEventDetail from './SingleBlockEventDetail.vue';
import SingleBlockExtrinsicsDetail from './SingleBlockExtrinsicsDetail.vue';

@Component({
  components: {
    Card,
    DisabledInput,
    SingleBlockDetail,
    SingleBlockEventDetail,
    SingleBlockExtrinsicsDetail
  },
})
export default class BlockDetails extends Vue {
	@Prop(String) public lastBlock!: string;
  @Prop(String) public chainName!: string;
  @Prop() public queryBlock!: string;
}
</script>

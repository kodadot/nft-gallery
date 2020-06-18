<template>
  <div id="blockdetails">
    <!-- http://localhost:9090/#/galactic/1/0x6ce34b8aab401c1fdf620f0a64c8902861824c7871f14aa651d08b61b935b5a1 -->
    <DisabledInput v-if="typeof chainName === 'string'" 
      label="Chain" :value="chainName" />
    <DisabledInput v-if="typeof lastBlock === 'string'" 
      label="Finalized Block" :value="lastBlock" />

    <div class="columns">
      <div class="column is-8 is-full-mobile">
        <b-field label="block"></b-field> 
        <SingleBlockDetail 
          :hash="queryBlock" 
          :open="true" />
      </div>
    </div>
    
    <div class="columns">
			<div class="column is-8 is-full-mobile">
				<b-field label="extrinsics"></b-field> 
        <SingleBlockExtrinsicsDetail 
          :hash="queryBlock"
          :open="true" />
			</div>
		</div>
    <div class="columns">
      <div class="column is-8 is-full-mobile">
				<b-field label="events"></b-field>
				<SingleBlockEventDetail 
          :hash="queryBlock" />
			</div>
    </div>
		<div class="columns">
			<div class="column is-8 is-full-mobile">
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

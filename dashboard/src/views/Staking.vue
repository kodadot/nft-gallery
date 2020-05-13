<template>
  <div>
    <b-tabs v-model="activeTab" multiline >
      <b-tab-item label="Overview">
        <Overview />
      </b-tab-item>
      <!-- <b-tab-item label="Account actions">
        
      </b-tab-item>
      <b-tab-item label="Payouts">
        
      </b-tab-item>
      <b-tab-item label="Payouts">
        
      </b-tab-item>
      <b-tab-item label="Targets">
        
      </b-tab-item>
      <b-tab-item label="Waiting">
        
      </b-tab-item>
      <b-tab-item label="Validator stats">
        
      </b-tab-item> -->
    </b-tabs>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Overview from '@/components/staking/Overview.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Overview,
  }
})
export default class Staking extends Vue {
  private activeTab: number = 0;
  private stakingOverview: any = [];
  private validators: any = [];
  private subs: any[] = [];

  public async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.staking.overview((value: any) => this.stakingOverview = value));
    this.validators = this.stakingOverview.validators.map((a) => a.toString());
  }

  private beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>

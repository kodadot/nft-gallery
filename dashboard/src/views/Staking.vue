<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
      </b-tab-item>
    </b-tabs>
      <!-- <b-tab-item label="Accounts">
        <AccountsInfo />
      </b-tab-item>
      <b-tab-item label="Staking">
        <StakerInfo />
      </b-tab-item> -->
      <!-- <b-tab-item label="Payouts">
      </b-tab-item>
      <b-tab-item label="Payouts">
      </b-tab-item>
      <b-tab-item label="Targets">
      </b-tab-item>
      <b-tab-item label="Waiting">
      </b-tab-item>
      <b-tab-item label="Validator stats">
      </b-tab-item> -->
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Overview from '@/components/staking/Overview.vue';
// import Targets from '@/components/staking/Targets/Targets.vue';
// import Waiting from '@/components/staking/Waiting/Waiting.vue';
import Actions from '@/components/staking/Actions/Actions.vue';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    // Overview,
    // Targets,
    // Waiting,
    Actions
  }
})
export default class Staking extends Vue {
  private activeTab: number = 0;
  private components: string[] = ['Actions']
  // private stakingOverview: any = [];
  // private stashIds: any = [];
  // private validators: any = [];
  // private next: any = [];
  // private subs: any[] = [];

  // public async mounted() {
  //   const { api } = Connector.getInstance();
  //   let stashes: any;
  //   this.subs.push(await api.derive.staking.overview((value: any) => this.stakingOverview = value));
  //   this.subs.push(await api.derive.staking.stashes((value: any) => stashes = value));
  //   // this.stashIds = stashes.map((accountId: any) => accountId.toString())
  //   // this.validators = this.stakingOverview.validators.map((a: any) => a.toString());
  //   this.next = this.stashIds.filter((address: any) => !this.stakingOverview.validators.includes(address as any))
  // }

  // private beforeDestroy() {
  //   this.subs.forEach((sub) => sub());
  // }
}
</script>

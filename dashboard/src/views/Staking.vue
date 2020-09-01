<template>
  <div>
    <b-tabs v-model="activeTab" @input="tabClick">
      <b-tab-item v-for="l in labels" :key="l" :label="l">
      </b-tab-item>
    </b-tabs>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Staking extends Vue {
  private activeTab: number = 0;
  private labels: string[] = ['Overview', 'Actions', 'Targets', 'Waiting', 'Payouts']
    
  @Watch('$route.params.tab')
  private async reflect() {
    if (typeof this.$route.params.tab === 'number') {
      this.activeTab = Number(this.$route.params.tab);
    }
  }

  private async tabClick(): Promise<void> {
    this.$router.replace(`/staking/${this.activeTab}`)
  }

  private async mounted(): Promise<void> {
    this.reflect();
  }
}
</script>

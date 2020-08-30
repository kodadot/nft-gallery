<template>
  <div>
    <b-tabs v-model="activeTab" >
      <b-tab-item label="Overview">
      </b-tab-item>
      <b-tab-item label="Targets">
      </b-tab-item>
    </b-tabs>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Staking extends Vue {
  private activeTab: number = 0;
  private components: string[] = ['Actions']

  @Watch('$route.params.tab')
  private async reflect() {
    if (typeof this.$route.params.tab === 'number') {
      this.activeTab = Number(this.$route.params.tab);
    }
  }

  private async tabClick(): Promise<void> {
    this.$router.replace(`/accounts/${this.activeTab}`)
  }

  private async mounted(): Promise<void> {
    this.reflect();
  }
}
</script>

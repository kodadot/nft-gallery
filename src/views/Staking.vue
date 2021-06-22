<template>
   <b-tabs v-model="activeTab" destroy-on-hide>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
      </b-tab-item>
    </b-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
const Overview = () => import('@/components/staking/Overview.vue')
const Actions = () => import('@/components/staking/Actions/Actions.vue')
const Targets = () => import('@/components/staking/Targets/Targets.vue')
const Waiting = () => import('@/components/staking/Waiting/Waiting.vue')
const Payouts = () => import('@/components/staking/Payouts/Payouts.vue')

@Component({
  components: {
    Overview,
    Actions,
    Targets,
    Waiting,
    Payouts
  }
})
export default class TreasuryWrapper extends Vue {
  public activeTab: number = 0;

  public components: string[] = ['Overview', 'Actions', 'Targets', 'Waiting', 'Payouts']
}
</script>

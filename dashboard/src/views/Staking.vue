<template>
  <div>
    <b-tabs v-model="activeTab" multiline >
      <b-tab-item label="Overview">
        
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

@Component({})
export default class Staking extends Vue {
  private activeTab: number = 0;
}
</script>

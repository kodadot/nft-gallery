<template>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Democracy">
        <Democracy/>
      </b-tab-item>
      <b-tab-item label="Referendums"><Referendums/></b-tab-item>
      <b-tab-item label="Proposal"><Proposals/></b-tab-item>
    </b-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Democracy from './Democracy.vue';
import Referendums from './Referendums.vue';
import Proposals from './Proposals.vue';

@Component({
  components: {
    Democracy,
    Referendums,
    Proposals,
  },
})
export default class DemocracyWrapper extends Vue {
  public activeTab: number = 0;
  

}
</script>
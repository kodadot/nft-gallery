<template>
    <div>
      <Referendum v-for="(ref, index) in referendums" :key="index" :referendum="ref" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Referendum from './Referendum.vue';

@Component({
  components: {
    Referendum,
  },
})
export default class Referendums extends Vue {
  private referendums: any[] = [];



  public mounted() {
    this.loadReferendas();
  }

  public async loadReferendas() {
    if ((this as any).$http.api) {
      const referendums = await (this as any).$http.api.derive.democracy.referendums();
      console.log('referendas', referendums);
      this.referendums = referendums;
      
    }
  }

  
  

}
</script>
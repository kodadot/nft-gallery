<template>
  <div class="Accounts">
    <Identicon
      :value="tmpAcc.alice"
      theme="polkadot"
      size="64"
    />
    {{tmpAcc.alice}}
    <Identicon
      :value="tmpAcc.bob"
      theme="substrate"
      size="64"
    />
    {{tmpAcc.bob}}
    <Identicon
      :value="tmpAcc.charlie"
      theme="beachball"
      size="64"
    />
    {{tmpAcc.charlie}}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';

@Component({
  components: {
    Identicon,
  },
})
export default class Accounts extends Vue {
  public tmpAcc: object = {
    alice: 'SXYSytZ7wxpQHbRo5FzUFA9wjTfWvTQgYzhVEybWRQvBrvMS',
    bob: 'SVyHhpNypEpW8awHeL2XVpEydcedTv1M4AZABcTqMRzx61Ja',
    charlie: 'SW1wmzX29Ei8mCLxB7crVUhGTkL1TDtCUwpVickwdqBUNunM',
   };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

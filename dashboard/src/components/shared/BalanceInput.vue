
<template>
  <div>
    <Balance
      :argument="{ name: 'balance', type: 'balance' }"
      @selected="handleValue"
    />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import Balance from '@/params/components/Balance.vue';

const components = { Balance }

type BalanceType = {
  balance: number;
}

@Component({ components })
export default class BalanceInput extends Vue {
  @Prop() public value!: number;
  
  @Emit('input')
  public handleValue(value: BalanceType) {
    return value.balance;
  }
}
</script>

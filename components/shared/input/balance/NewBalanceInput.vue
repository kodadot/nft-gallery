<template>
  <BasicBalanceInput
    ref="magicBalanceInput"
    v-model="vValue"
    :decimals="decimals"
    :unit="unit" />
</template>

<script lang="ts">
import { Component, VModel, mixins } from 'nuxt-property-decorator'
import ChainMixin from '@/utils/mixins/chainMixin'
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'

@Component({
  components: {
    BasicBalanceInput,
  },
})
export default class NewBalanceInput extends mixins(ChainMixin) {
  @VModel() vValue!: string | number

  public checkValidity() {
    const balanceInputComponent = this.$refs
      .magicBalanceInput as BasicBalanceInput
    return balanceInputComponent.checkValidity()
  }
}
</script>

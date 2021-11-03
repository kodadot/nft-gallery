<template>
  <div>
    <AddressParser v-model="parsedAddresses" />
    <BasicSlider
      v-model="distribution"
      label="action.distributionCount"
    />

    <BasicSwitch v-model="random" label="action.random" />
  </div>
</template>

<script lang="ts" >
import { ProcessFunction, sendFunction, SendType } from '@/components/accounts/utils'
import shouldUpdate from '@/utils/shouldUpdate'
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'

const components = {
  AddressParser: () => import('@/components/accounts/AddressParser.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue')
}

@Component({ components })
export default class SendHandler extends Vue {
  protected parsedAddresses: string[] = [];
  protected random = false;
  protected distribution = 100;

  @Watch('parsedAddresses')
  protected onParsedAddressedChanged(parsedAddresses: string[], oldVal: string[]): void {
    if (shouldUpdate(parsedAddresses.length, oldVal.length)) {
      this.onInput({
        parsedAddresses,
        random: this.random,
        distribution: this.distribution
      })
    }
  }

  @Watch('random')
  protected onRandomChange(random: boolean, oldVal: boolean): void {
    if (shouldUpdate(random, oldVal)) {
      this.onInput({
        parsedAddresses: this.parsedAddresses,
        random,
        distribution: this.distribution
      })
    }
  }

  @Watch('distribution')
  protected onDistributionChanged(distribution: number, oldVal: number): void {
    if (shouldUpdate(distribution, oldVal)) {
      this.onInput({
        parsedAddresses: this.parsedAddresses,
        random: this.random,
        distribution
      })
    }
  }

  @Emit('input')
  protected onInput(self: SendType): ProcessFunction {
    return sendFunction(self.parsedAddresses, self.distribution, self.random)
  }
}
</script>

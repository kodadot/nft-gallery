<template>
  <div>
    <AddressParser v-model="parsedAddresses" />
    <BasicSlider v-model="distribution" label="action.distributionCount" />

    <BasicSwitch v-model="random" label="action.random" />
  </div>
</template>

<script lang="ts">
import {
  ProcessFunction,
  sendFunction,
  SendType,
  shuffleFunction,
} from '@/components/accounts/utils'
import shouldUpdate from '@/utils/shouldUpdate'
import { Debounce } from 'vue-debounce-decorator'
import Connector from '@vue-polkadot/vue-api'
import { Component, Emit, Vue, Watch } from 'nuxt-property-decorator'

const components = {
  AddressParser: () => import('@/components/accounts/AddressParser.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue'),
}

@Component({ components })
export default class SendHandler extends Vue {
  protected parsedAddresses: string[] = []
  protected random = false
  protected distribution = 100
  protected seed: number[] = []

  public created(): void {
    setTimeout(this.fetchRandomSeed, 3000)
  }

  public async fetchRandomSeed(): Promise<void> {
    const { api } = Connector.getInstance()
    const random = await api.query.babe.randomness()
    this.seed = Array.from(random)
  }

  @Watch('parsedAddresses')
  @Debounce(500)
  protected onParsedAddressedChanged(
    parsedAddresses: string[],
    oldVal: string[]
  ): void {
    if (shouldUpdate(parsedAddresses.length, oldVal.length)) {
      this.onInput({
        parsedAddresses,
        random: this.random,
        distribution: this.distribution,
      })
    }
  }

  @Watch('random')
  @Debounce(500)
  protected onRandomChange(random: boolean, oldVal: boolean): void {
    if (shouldUpdate(random, oldVal)) {
      this.onInput({
        parsedAddresses: this.parsedAddresses,
        random,
        distribution: this.distribution,
      })
    }
  }

  @Watch('distribution')
  @Debounce(500)
  protected onDistributionChanged(distribution: number, oldVal: number): void {
    if (shouldUpdate(distribution, oldVal)) {
      this.onInput({
        parsedAddresses: this.parsedAddresses,
        random: this.random,
        distribution,
      })
    }
  }

  @Emit('input')
  protected onInput(self: SendType): ProcessFunction {
    console.log(self)
    return sendFunction(
      self.parsedAddresses,
      self.distribution,
      self.random ? shuffleFunction(this.seed) : undefined
    )
  }
}
</script>

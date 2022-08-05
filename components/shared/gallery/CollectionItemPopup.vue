<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 300]">
    <template v-slot:trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container mb-2 ms-dos-shadow columns">
      <div class="column">
        <div>ITEMS : {{ identity.items }}</div>
        <div>VOLUME: {{ identity.volume }}</div>
      </div>
      <div class="column">
        <div>OWNED: {{ identity.owned }}</div>
        <div>FLOOR: {{ identity.floor }}</div>
      </div>
    </div>
  </v-tippy>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import ChainMixin from '@/utils/mixins/chainMixin'

type IdentityFields = Record<string, string>

@Component({})
export default class IdentityPopover extends mixins(ChainMixin) {
  @Prop() public identity!: IdentityFields

  protected totalCreated = 0
  protected totalCollected = 0
  protected totalSold = 0
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 2px solid $primary;
  max-width: 350px;
  white-space: nowrap;
}

.popover-image {
  min-width: 60px;
}

.popover-stats-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.copy-icon {
  cursor: pointer;
}

.break-word {
  overflow-wrap: break-word;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>

<template>
  <b-progress
    :value="actualValue"
    :max="maxValue"
    size="is-large"
    type="is-primary"
    show-value
  >
    {{ actualValue }} / {{ maxValue }}
  </b-progress>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { toNumber } from '@/utils/filters'

@Component
export default class ProgressBar extends Vue {
  @Prop() public value: any;
  @Prop() public max: any;

  get actualValue() {
    return toNumber(this.value)
  }

  get maxValue() {
    return toNumber(this.max)
  }
}
</script>

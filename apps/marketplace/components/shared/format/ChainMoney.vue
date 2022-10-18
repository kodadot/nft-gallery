<template>
  <BasicMoney
    :value="value"
    :unit="unit"
    :decimals="decimals"
    :inline="inline"
    :hide-unit="hideUnit" />
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import BasicMoney from '@/components/shared/format/BasicMoney.vue'
import ChainMixin from '@/utils/mixins/chainMixin'

@Component({
  components: {
    BasicMoney,
  },
})
export default class Money extends mixins(ChainMixin) {
  @Prop({ default: '0' }) readonly value: number | string | undefined

  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean
}
</script>

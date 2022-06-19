<template>
  <b-table :data="attributes" :columns="columns" />
</template>

<script lang="ts">
import { Attribute, emptyArray } from '@kodadot1/minimark'
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Offer } from './types'

@Component({})
export default class OfferTable extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
}
</script>

<template>
  <CollapseCardWrapper label="properties">
    <b-table :data="displayAttributes" :columns="columns" />
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { emptyArray } from '~/utils/empty'
import { Attribute } from '@kodadot1/minimark'

const components = {
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
}

@Component({ components })
export default class Properties extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public attributes!: Attribute[]
  protected columns = [
    {
      field: 'key',
      label: 'Key',
    },
    {
      field: 'value',
      label: 'Value',
    },
  ]

  get displayAttributes() {
    return this.attributes.filter((attribute) => attribute['key'])
  }
}
</script>

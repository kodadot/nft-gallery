<template>
  <CollapseCardWrapper :label="$t('nft.properties.label')">
    <b-table :data="displayAttributes" :columns="columns" />
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { emptyArray } from '~/utils/empty'
import { Attribute } from '../../types'

const components = {
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
}

@Component({ components })
export default class Properties extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public attributes!: Attribute[]
  @Prop({ type: String, default: 'key' }) private fieldKey!: string

  get displayAttributes() {
    return this.attributes
      .map((attr) => {
        return {
          [this.fieldKey]: '',
          ...attr,
        }
      })
      .filter((attribute) => attribute[this.fieldKey] || attribute.value)
  }

  get columns() {
    return [
      {
        field: this.fieldKey,
        label: 'Key',
      },
      {
        field: 'value',
        label: 'Value',
      },
    ]
  }
}
</script>

<template>
  <CollapseCardWrapper :label="$t('nft.properties.label')">
    <div class="columns is-mobile is-multiline">
      <div
        v-for="attribute in attributes"
        :key="attribute[fieldKey]"
        class="column is-half-mobile is-half-tablet is-one-third-desktop is-one-quarter-fullhd">
        <div class="notification is-primary is-light">
          <div
            class="is-size-7 has-text-grey-lighter is-uppercase properties-attribute-key">
            {{ attribute[fieldKey] === 'undefined' ? '' : attribute[fieldKey] }}
          </div>
          <div class="is-size-7 has-text-white">{{ attribute.value }}</div>
        </div>
      </div>
    </div>
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Attribute } from '@kodadot1/minimark'
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { emptyArray } from '~/utils/empty'

const components = {
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
}

@Component({ components })
export default class Properties extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public attributes!: Attribute[]
  @Prop({ type: String, default: 'trait_type' }) public fieldKey!: string
}
</script>
<style>
.properties-attribute-key {
  min-height: 18px;
}
</style>
>

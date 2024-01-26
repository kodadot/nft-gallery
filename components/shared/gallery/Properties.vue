<template>
  <CollapseCardWrapper :label="$t('nft.properties.label')">
    <div class="columns is-mobile is-multiline">
      <div
        v-for="attribute in attributes"
        :key="attribute[fieldKey]"
        class="column is-half-mobile is-half-tablet is-one-third-desktop is-one-quarter-fullhd">
        <div class="notification is-primary is-light">
          <div
            class="text-xs text-k-grey-lighter uppercase properties-attribute-key">
            {{ attribute[fieldKey] === 'undefined' ? '' : attribute[fieldKey] }}
          </div>
          <div class="text-xs has-text-white">{{ attribute.value }}</div>
        </div>
      </div>
    </div>
  </CollapseCardWrapper>
</template>

<script lang="ts" setup>
import { Attribute } from '@kodadot1/minimark/common'
import { emptyArray } from '~/utils/empty'
import CollapseCardWrapper from '@/components/shared/collapse/CollapseCardWrapper.vue'

withDefaults(
  defineProps<{
    attributes: Attribute[]
    fieldKey: string
  }>(),
  {
    attributes: () => emptyArray<Attribute>(),
    fieldKey: 'trait_type',
  },
)
</script>

<style>
.properties-attribute-key {
  min-height: 18px;
}
</style>

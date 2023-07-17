<template>
  <div>
    <div v-if="showExplainerText && isLogIn" class="mb-2">
      <small>
        {{ $t('createNftExplainer') }}
      </small>
    </div>
    <NeoField
      :label="$t('collection')"
      :message="$t('Select collection where do you want mint your token')">
      <NeoSelect
        v-model="selectedCollection"
        placeholder="Select a collection"
        expanded>
        <option disabled selected value="">--</option>
        <option v-for="option in collections" :key="option.id" :value="option">
          {{ option.name || option.id }} ({{ option.totalCount }})
        </option>
      </NeoSelect>
    </NeoField>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, mixins } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField, NeoSelect } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
    NeoSelect,
  },
})
export default class CollectionSelect extends mixins(AuthMixin) {
  @VModel({ default: null }) selectedCollection!: MintedCollection
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean
}
</script>

<template>
  <b-field
    :label="$i18n.t('Collection')"
    :message="$t('Select collection where do you want mint your token')">
    <b-select
      placeholder="Select a collection"
      v-model="selectedCollection"
      expanded>
      <option disabled selected value="">--</option>
      <option v-for="option in collections" :value="option" :key="option.id">
        {{ option.name || option.id }} ({{ option.alreadyMinted }})
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, VModel, Prop } from 'nuxt-property-decorator'
import { BaseMintedCollection as MintedCollection } from './types'

@Component({})
export default class CollectionSelect extends Vue {
  @VModel({ default: null }) selectedCollection!: MintedCollection
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]
}
</script>

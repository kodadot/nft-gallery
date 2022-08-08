<template>
  <div>
    <div class="mb-2" v-if="showExplainerText && isLogIn">
      <small>
        {{ $t('createNftExplainer') }}
      </small>
    </div>
    <b-field
      :label="$t('collection')"
      :message="$t('Select collection where do you want mint your token')">
      <b-select
        placeholder="Select a collection"
        v-model="selectedCollection"
        expanded>
        <option disabled selected value="">--</option>
        <option v-for="option in collections" :value="option" :key="option.id">
          {{ option.name || option.id }} ({{ option.totalCount }})
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, VModel, Prop, mixins } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import { BaseMintedCollection as MintedCollection } from './types'

@Component({})
export default class CollectionSelect extends mixins(AuthMixin) {
  @VModel({ default: null }) selectedCollection!: MintedCollection
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean
}
</script>

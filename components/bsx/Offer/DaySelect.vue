<template>
  <b-field :label="$t('offer.daySelectLabel')">
    <b-select
      placeholder="$t('offer.daySelectPlaceholder')"
      v-model="selectedDays"
      expanded>
      <option v-for="option in days" :value="option" :key="option">
        {{ option }} {{ $t('offer.days') }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, VModel, Prop } from 'nuxt-property-decorator'

@Component({})
export default class DaySelect extends Vue {
  @VModel({ default: 14 }) selectedDays!: number
  @Prop({ type: Array, default: () => [] }) days!: number[]
}
</script>

<template>
  <NeoField :label="$t('offer.daySelectLabel')">
    <b-select
      v-model="selectedDays"
      placeholder="$t('offer.daySelectPlaceholder')"
      expanded>
      <option v-for="option in days" :key="option" :value="option">
        {{ option }} {{ $t('offer.days') }}
      </option>
    </b-select>
  </NeoField>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'
import { NeoField } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
  },
})
export default class DaySelect extends Vue {
  @VModel({ default: 14 }) selectedDays!: number
  @Prop({ type: Array, default: () => [] }) days!: number[]
}
</script>

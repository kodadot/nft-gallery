<template>
  <div>
    <b-field class="columns mb-0">
      <b-input
        v-model="range[0]"
        type="number"
        min="0"
        step="any"
        class="column is-2"
        :placeholder="$t('query.priceRange.minPrice')"
        data-cy="input-min">
      </b-input>
      <b-input
        v-model="range[1]"
        min="0"
        step="any"
        type="number"
        class="column is-2"
        :placeholder="$t('query.priceRange.maxPrice')"
        data-cy="input-max">
      </b-input>
      <div class="column is-1">
        <b-button
          class="is-primary"
          :disabled="applyDisabled"
          data-cy="apply"
          @click="rangeChange">
          {{ $t('general.apply') }}
        </b-button>
      </div>
    </b-field>
    <p v-if="applyDisabled" class="help is-danger">
      {{ $t('query.priceRange.priceValidation') }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class SearchPriceRange extends Vue {
  @Prop({ type: Array, required: false, default: () => [undefined, undefined] })
  public range!: [number | string | undefined, number | string | undefined]

  get applyDisabled(): boolean {
    const [min, max] = this.range as [string | undefined, string | undefined]
    if (!min || !max) {
      return false
    }
    return parseFloat(min) > parseFloat(max)
  }

  public rangeChange(): void {
    this.$emit('input', this.range)
  }
}
</script>

<template>
  <div>
    <NeoField class="columns mb-0">
      <NeoInput
        v-model="vrange[0]"
        type="number"
        min="0"
        step="any"
        class="column is-2"
        :placeholder="$t('query.priceRange.minPrice')"
        data-testid="input-min" />
      <NeoInput
        v-model="vrange[1]"
        min="0"
        step="any"
        type="number"
        class="column is-2"
        :placeholder="$t('query.priceRange.maxPrice')"
        data-testid="input-max" />
      <div class="column is-1">
        <NeoButton
          variant="primary"
          :disabled="applyDisabled"
          data-testid="apply"
          @click.native="rangeChange">
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </NeoField>
    <p v-if="applyDisabled" class="help is-danger">
      {{ $t('query.priceRange.priceValidation') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoField, NeoInput } from '@kodadot1/brick'

const emit = defineEmits(['input'])

const props = withDefaults(
  defineProps<{
    range: [number | string | undefined, number | string | undefined]
  }>(),
  {
    range: () => [undefined, undefined],
  }
)

const vrange = computed(() => props.range)

const applyDisabled = computed(() => {
  const [min, max] = props.range as [string | undefined, string | undefined]
  if (!min || !max) {
    return false
  }
  return parseFloat(min) > parseFloat(max)
})

const rangeChange = () => {
  emit('input', props.range)
}
</script>

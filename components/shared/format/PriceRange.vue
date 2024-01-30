<template>
  <div :class="[{ 'inline-block': inline }]">
    {{ $t('query.priceRange.range') }} {{ $t('general.from') }}
    <Money :value="from" inline />
    <span v-if="to">
      {{ $t('general.to') }}
      <Money :value="to" inline />
    </span>
  </div>
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'

defineProps({
  inline: { type: Boolean, default: true },
})

const route = useRoute()
const decimals = useChain()

const from = computed(() => {
  if (route.query.min) {
    return parseFloat(route.query.min.toString()) * 10 ** Number(decimals)
  }
  return undefined
})
const to = computed(() => {
  if (route.query.max) {
    return parseFloat(route.query.max.toString()) * 10 ** Number(decimals)
  }
  return undefined
})
</script>

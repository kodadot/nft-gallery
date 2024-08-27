<template>
  <div>
    <div class="flex gap-4">
      <div
        class="flex focus-within:!border-border-color border border-k-shade h-10 w-full flex-1"
      >
        <input
          v-model="model"
          type="number"
          step="0.01"
          min="0.0001"
          pattern="[0-9]+([\.,][0-9]+)?"
          class="indent-2.5 border-none outline-none w-20 bg-background-color text-text-color w-full"
          :placeholder="$t('offer.typeOffer')"
        >
      </div>

      <NeoButton
        no-shadow
        expanded
        class="w-fit !border-k-grey"
        @click="switchSymbolMode"
      >
        <div class="flex items-center gap-1">
          <div class="flex items-center">
            {{ isSymbolMode ? chainSymbol : 'USD' }}
          </div>
          <NeoIcon
            class="text-k-grey"
            icon="arrows-cross"
          />
        </div>
      </NeoButton>
    </div>

    <div class="flex justify-end text-k-grey text-xs mt-3 gap-1">
      {{ $t('general.balance') }}:
      <span v-if="isSymbolMode">
        {{ balance }} {{ chainSymbol }}
      </span>
      <span v-else>
        {{ balanceUsd }} USD
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const props = defineProps<{
  modelValue?: number | string
  check?: boolean
}>()
const { chainSymbol } = useChain()
const { urlPrefix } = usePrefix()
const { balance } = useDeposit(urlPrefix)
const emit = defineEmits(['update:modelValue'])

const isSymbolMode = ref(true)
const tokenPrice = ref(0)
const switchSymbolMode = () => {
  isSymbolMode.value = !isSymbolMode.value
}

const balanceUsd = computed(() => {
  return balance.value * tokenPrice.value
})

const tokenAmount = ref<string | number | undefined>(props.modelValue || '')

const model = computed({
  get: () => tokenAmount.value,
  set: (value) => {
    const newTokenAmount = value === ''
      ? undefined
      : (isSymbolMode.value ? value : (Number(value) / tokenPrice.value))
    emit('update:modelValue', newTokenAmount)
    tokenAmount.value = value
  },
})

watch(urlPrefix, async () => {
  tokenPrice.value = Number((await getApproximatePriceOf(chainSymbol.value)).toFixed(2))
}, {
  immediate: true,
})

watch(isSymbolMode, async (isSymbol) => {
  if (isSymbol) {
    model.value = (Number(model.value) / tokenPrice.value)
  }
  else {
    model.value = (Number(model.value) * tokenPrice.value)
  }
})
</script>

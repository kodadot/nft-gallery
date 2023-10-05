<template>
  <NeoSwitch v-model="model" :type="type" :rounded="false">
    <div class="is-flex is-align-items-center">
      <span class="mr-2">
        {{ value ? `${$t(activeMessage)}${priceString}` : $t(passiveMessage) }}
      </span>
      <slot name="tooltip" />
    </div>
  </NeoSwitch>
</template>

<script lang="ts" setup>
import { round } from '@/utils/support'
import { NeoSwitch } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    value: boolean
    showPrice?: boolean
    price?: number
    activeMessage: string
    passiveMessage: string
    type: string
  }>(),
  {
    showPrice: true,
    price: 0,
    activeMessage: 'I am helping to cover costs',
    passiveMessage: 'I do not want to support',
    type: '',
  },
)
const emit = defineEmits(['input'])
const priceString = ref(props.showPrice ? ` ($ ${round(props.price)})` : '')
const model = computed({
  get: () => props.value,
  set: (value: boolean) => emit('input', value),
})
</script>

<template>
  <NeoSwitch v-model="model" :type="type" :rounded="false">
    <div class="is-flex is-align-items-center">
      <span class="mr-2">
        {{
          modelValue ? `${$t(activeMessage)}${priceString}` : $t(passiveMessage)
        }}
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
    modelValue: boolean
    showPrice?: boolean
    price?: number
    activeMessage?: string
    passiveMessage?: string
    type?: string
  }>(),
  {
    showPrice: true,
    price: 0,
    activeMessage: 'I am helping to cover costs',
    passiveMessage: 'I do not want to support',
    type: '',
  },
)

const model = useVModel(props, 'modelValue')
const priceString = ref(props.showPrice ? ` ($ ${round(props.price)})` : '')
</script>

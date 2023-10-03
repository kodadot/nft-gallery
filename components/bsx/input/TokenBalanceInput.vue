<template>
  <BasicBalanceInput
    ref="balanceInputComponent"
    v-model="vValue"
    :decimals="decimals"
    :unit="unit"
    expanded />
</template>

<script setup lang="ts">
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'
const balanceInputComponent = ref<BasicBalanceInput>()
const emit = defineEmits(['input'])

defineExpose({
  checkValidity,
})

const props = defineProps({
  value: { type: String || Number, required: true },
  tokenId: { type: String || Number, required: false, default: '5' },
})

const vValue = computed({
  get: () => props.value,
  set: (value) => {
    emit('input', value)
  },
})

const { assets } = usePrefix()
const asset = computed(() => assets(props.tokenId))
const unit = computed(() => asset.value.symbol)
const decimals = computed(() => asset.value.decimals)

function checkValidity() {
  return balanceInputComponent.value?.checkValidity()
}
</script>

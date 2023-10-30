<template>
  <div>
    <BasicNumberInput
      v-model="vRoyalty"
      :label="$t('mint.royalty.rate')"
      expanded
      :step="0.1"
      :min-step="0.01"
      :min="0"
      :max="99.99" />

    <BasicSwitch v-model="isMine" label="mint.royalty.mine" />
    <AddressInput
      v-show="!isMine"
      v-model="vAddress"
      label="mint.royalty.receiver"
      :strict="false"
      empty-on-error />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import BasicNumberInput from '@/components/shared/form/BasicNumberInput.vue'

const { accountId } = useAuth()

const props = defineProps({
  amount: {
    type: [Number, String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:amount', 'update:address'])

const vRoyalty = useVModel(props, 'amount', emit)
const vAddress = useVModel(props, 'address', emit)

const isMine = ref(true)

watch(isMine, () => {
  if (isMine.value) {
    vAddress.value = accountId.value
  }
})
</script>

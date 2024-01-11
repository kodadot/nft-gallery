<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm ref="collectionForm" v-model="base" protective-margin>
      <template #header>
        <NeoField>
          <div>
            {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
          </div>
        </NeoField>
      </template>
      <template #main>
        <BasicSwitch v-model="unlimited" label="mint.unlimited" />
        <NeoField
          v-if="!unlimited"
          class="mt-1"
          :label="$t('Maximum NFTs in collection')">
          <NeoInput
            v-model="max"
            type="number"
            placeholder="1 is the minimum"
            :min="1" />
        </NeoField>
        <BasicInput
          ref="symbolInput"
          v-model="symbol"
          :label="$t('mint.collection.symbol.label')"
          :message="$t('mint.collection.symbol.message')"
          :placeholder="$t('mint.collection.symbol.placeholder')"
          class="mb-5"
          maxlength="10"
          required
          expanded
          @keydown.space.prevent />
      </template>

      <template #footer>
        <NeoField
          v-if="isLogIn"
          variant="danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="create collection"
            :loading="isLoading"
            @click="submit" />
        </NeoField>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts" setup>
import { generateId } from '@/components/rmrk/service/Consolidator'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Interaction } from '@kodadot1/minimark/v1'
import Loader from '@/components/shared/Loader.vue'
import BasicInput from '@/components/shared/form/BasicInput.vue'
import BaseCollectionForm from '@/components/base/BaseCollectionForm.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import { NeoField, NeoInput } from '@kodadot1/brick'
import { BaseCollectionType } from '@/composables/transaction/types'
import useLoader from '@/composables/useLoader'

interface ComponentWithCheckValidity extends Vue {
  checkValidity(): boolean
}

const base = ref<BaseCollectionType>({
  name: '',
  file: null,
  description: '',
})
const symbol = ref('')
const max = ref(1)
const unlimited = ref(true)
const collectionForm = ref<ComponentWithCheckValidity>()
const symbolInput = ref<ComponentWithCheckValidity>()
const { accountId, balance, isLogIn } = useAuth()
const { isLoading, status } = useLoader()
const emit = defineEmits(['created'])
const { $i18n } = useNuxtApp()

const checkValidity = () => {
  return (
    collectionForm.value?.checkValidity() && symbolInput.value?.checkValidity()
  )
}

const rmrkId = computed(() => generateId(accountId.value, symbol.value))

const balanceNotEnough = computed(() => Number(balance.value) <= 2)
const balanceNotEnoughMessage = computed(() =>
  balanceNotEnough.value ? $i18n.t('tooltip.notEnoughBalance') : '',
)
const isMintDisabled = computed(() => balanceNotEnough.value)

const submit = async () => {
  if (!checkValidity()) {
    return
  }

  if (isMintDisabled.value) {
    return
  }

  isLoading.value = true
  status.value = 'loader.ipfs'

  const {
    transaction,
    status: txStatus,
    isLoading: txIsLoading,
    blockNumber,
  } = useTransaction()

  watch([txIsLoading, txStatus], () => {
    isLoading.value = txIsLoading.value
    if (Boolean(txStatus.value)) {
      status.value = txStatus.value
    }
  })

  watch(blockNumber, (block) => {
    if (block) {
      emit('created')
    }
  })

  try {
    transaction({
      interaction: Interaction.MINT,
      urlPrefix: usePrefix().urlPrefix.value,
      collection: {
        ...base.value,
        nftCount: unlimited.value ? 0 : max.value,
        symbol: symbol.value,
      },
    })
  } catch (e) {
    showNotification(`[ERR] ${e}`, notificationTypes.warn)
    console.error(e)
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <Loader v-model="isTransactionLoading" :status="transactionStatus" />
    <BaseCollectionForm ref="collectionForm" v-bind.sync="base">
      <template #main>
        <NeoField class="mb-5" />
      </template>
      <template #footer>
        <!-- Hidden as of 11.July.2022 due to lack of convenience #3407 -->
        <!-- <CustomAttributeInput
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" /> -->
        <NeoField>
          <p class="has-text-weight-medium is-size-6 has-text-info">
            {{ $t('mint.deposit') }}:
            <Money :value="collectionDeposit" :token-id="tokenId" inline />
          </p>
        </NeoField>
        <NeoField>
          <AccountBalance />
        </NeoField>
        <NeoField>
          <MultiPaymentFeeButton :account-id="accountId" :prefix="urlPrefix" />
        </NeoField>
        <NeoField variant="danger" :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="create collection"
            :loading="isTransactionLoading"
            @click="submit" />
        </NeoField>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts" setup>
import { Attribute } from '@/components/rmrk/types'
import {
  getMetadataDeposit,
  getclassDeposit,
} from '@/components/unique/apiConstants'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Interaction } from '@kodadot1/minimark/v1'
import { onApiConnect } from '@kodadot1/sub-api'
import { BaseCollectionType } from '@/composables/transaction/types'
import shouldUpdate from '@/utils/shouldUpdate'
import { Token, getBalance, getDeposit, getFeesToken } from './utils'
import { NeoField } from '@kodadot1/brick'
import Loader from '@/components/shared/Loader.vue'
import BaseCollectionForm from '@/components/base/BaseCollectionForm.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import Money from '@/components/bsx/format/TokenMoney.vue'
import AccountBalance from '@/components/shared/AccountBalance.vue'
import MultiPaymentFeeButton from '@/components/bsx/specific/MultiPaymentFeeButton.vue'

const emit = defineEmits(['created'])

const { $i18n, $consola } = useNuxtApp()
const { accountId } = useAuth()
const { apiUrl } = useApi()
const { urlPrefix, tokenId } = usePrefix()
const { status: transactionStatus, isLoading: isTransactionLoading } =
  useTransactionStatus()

const base = ref<BaseCollectionType>({
  name: '',
  file: null,
  description: '',
})
const collectionDeposit = ref('')
const attributes = ref<Attribute[]>([])
const balanceNotEnough = ref(false)
const feesToken = ref<Token>('BSX')
const collectionForm = ref()

onApiConnect(apiUrl.value, (api) => {
  const classDeposit = getclassDeposit(api)
  const metadataDeposit = getMetadataDeposit(api)
  collectionDeposit.value = (classDeposit + metadataDeposit).toString()
})

function checkValidity() {
  return collectionForm.value?.checkValidity()
}

const balanceNotEnoughMessage = computed(() => {
  if (balanceNotEnough.value) {
    return $i18n.t('tooltip.notEnoughBalance')
  }
  return ''
})

const balanceOfToken = computed(() => getBalance(feesToken.value))
const depositOfToken = computed(() =>
  getDeposit(feesToken.value, parseFloat(collectionDeposit.value))
)

const { transaction, status, isLoading, blockNumber } = useTransaction()
watch([isLoading, status], () => {
  isTransactionLoading.value = isLoading.value
  if (Boolean(status.value)) {
    transactionStatus.value = status.value
  }
})
watch(blockNumber, (block) => {
  if (block) {
    emit('created')
  }
})

async function submit(): Promise<void> {
  // check fields
  if (!checkValidity()) {
    return
  }
  // check balance
  if (
    !!collectionDeposit.value &&
    balanceOfToken.value < depositOfToken.value
  ) {
    balanceNotEnough.value = true
    return
  }
  isTransactionLoading.value = true
  transactionStatus.value = 'loader.checkBalance'

  try {
    showNotification(
      $i18n.t('mint.creatingCollection', { name: base.value.name }),
      notificationTypes.info
    )
    transactionStatus.value = 'loader.ipfs'
    transaction({
      interaction: Interaction.MINT,
      urlPrefix: usePrefix().urlPrefix.value,
      collection: {
        ...base.value,
        tags: attributes.value,
      },
    })
  } catch (e) {
    showNotification(`[ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isTransactionLoading.value = false
  }
}

watch(
  accountId,
  async (val, oldVal) => {
    if (shouldUpdate(val, oldVal)) {
      feesToken.value = await getFeesToken()
    }
  },
  { immediate: true }
)
</script>

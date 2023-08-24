<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm ref="collectionForm" v-model="base">
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
            :loading="isLoading"
            @click="submit" />
        </NeoField>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Attribute } from '@/components/rmrk/types'
import {
  getMetadataDeposit,
  getclassDeposit,
} from '@/components/unique/apiConstants'
import { hasEnoughToken } from '@/components/unique/utils'
import formatBalance from '@/utils/format/balance'
import { notificationTypes, showNotification } from '@/utils/notification'
import { estimate } from '@/utils/transactionExecutor'
import { Interaction } from '@kodadot1/minimark/v1'
import { ApiFactory, onApiConnect } from '@kodadot1/sub-api'
import { dummyIpfsCid } from '@/utils/ipfs'
import { createArgs } from '@/composables/transaction/mintCollection/utils'
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

const { $consola, $i18n } = useNuxtApp()
const { balance } = useAuth()
const { decimals, unit } = useChain()
const { urlPrefix, tokenId } = usePrefix()
const { apiUrl } = useApi()

const { t } = $i18n

const emit = defineEmits(['created'])

const base: BaseCollectionType = {
  name: '',
  file: null,
  description: '',
}
const id = '0'
const attributes: Attribute[] = []

const collectionDeposit = ref('')
const balanceNotEnough = ref(false)
const feesToken = ref('BSX' as Token)
const collectionForm = ref()
const accountId = ref()
const isLoading = ref(false)
const status = ref('')

const checkValidity = () => {
  return collectionForm.value?.checkValidity()
}

const balanceNotEnoughMessage = computed(() => {
  if (balanceNotEnough.value) {
    return t('tooltip.notEnoughBalance')
  }
  return ''
})

watch(accountId, async (newVal, oldVal) => {
  if (shouldUpdate(newVal, oldVal)) {
    feesToken.value = await getFeesToken()
  }
})

const created = async () => {
  onApiConnect(apiUrl.value, (api) => {
    const classDeposit = getclassDeposit(api)
    const metadataDeposit = getMetadataDeposit(api)
    collectionDeposit.value = (classDeposit + metadataDeposit).toString()
  })
}

const balanceOfToken = computed(() => {
  return getBalance(feesToken.value)
})

const depositOfToken = computed(() => {
  return getDeposit(feesToken.value, parseFloat(collectionDeposit.value))
})

const tryToEstimateTx = async () => {
  const api = await ApiFactory.useApiInstance(apiUrl.value)
  const cb = api.tx.utility.batchAll
  const metadata = dummyIpfsCid()
  const randomId = 0
  const args = [createArgs(randomId, metadata)]
  return estimate(accountId.value, cb, args)
}

const checkBalanceBeforeTx = async () => {
  const estimated = await tryToEstimateTx()
  const deposit = collectionDeposit.value
  const hasTokens = hasEnoughToken(balance.value, estimated, deposit)
  $consola.log('hasTokens', hasTokens)
  if (!hasTokens) {
    throw new Error(
      `Not enough tokens: Currently have ${formatBalance(
        balance.value,
        decimals.value,
        unit.value
      )} tokens`
    )
  }
}

const submit = async () => {
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
  isLoading.value = true
  status.value = 'loader.checkBalance'

  const {
    transaction,
    status: transactionStatus,
    isLoading: transactionIsLoading,
    blockNumber,
  } = useTransaction()
  watch(
    [transactionIsLoading, transactionStatus],
    ([newTransactionIsLoading, newTransactionStatus]) => {
      isLoading.value = newTransactionIsLoading
      if (Boolean(newTransactionStatus)) {
        status.value = newTransactionStatus
      }
    }
  )
  watch(blockNumber, (block) => {
    if (block) {
      emit('created')
    }
  })

  try {
    // await this.checkBalanceBeforeTx()
    showNotification(
      t('mint.creatingCollection', { name: base.name }),
      notificationTypes.info
    )
    status.value = 'loader.ipfs'
    transaction({
      interaction: Interaction.MINT,
      urlPrefix: urlPrefix.value,
      collection: {
        ...base,
        tags: attributes,
      },
    })
  } catch (e) {
    showNotification(`[ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isLoading.value = false
  }
}
</script>

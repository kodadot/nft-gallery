<template>
  <Loader v-if="isLoading" v-model="isLoading" />
  <NeoButton
    v-else
    ref="root"
    class="mb-2 mt-4 mint-button"
    variant="secondary"
    label="Teleport Token"
    @click="handleTokenImport">
    <b
      >Missing <Money :value="price" inline /> on AssetHub? Click here to
      teleport them from Relay Chain</b
    >
  </NeoButton>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { ApiFactory } from '@kodadot1/sub-api'
import { getChainEndpointByPrefix } from '@/utils/chain'
import { Builder } from '@paraspell/sdk'
import { txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getAddress } from '@/utils/extension'
import { toDefaultAddress } from '@/utils/account'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'

const { urlPrefix } = usePrefix()
const { accountId, isLogIn } = useAuth()
const isLoading = ref(false)

defineProps({
  price: {
    type: String,
    default: '0',
  },
})

const { neoModal } = useProgrammatic()
const root = ref<Vue>()

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue'),
)

const getApi = () => {
  const value = urlPrefix.value === 'ahk' ? 'ksm' : 'dot'

  const endpoint = getChainEndpointByPrefix(value) as string
  return ApiFactory.useApiInstance(endpoint)
}

const handleTokenImport = async () => {
  if (!isLogIn.value) {
    neoModal.open({
      ...ConnectWalletModalConfig,
    })
    return
  }

  const api = await getApi()
  const to = urlPrefix.value === 'ahk' ? 'Statemine' : 'Statemint'
  const call = Builder(api)
    .to(to)
    .amount(price)
    .address(accountId.value)
    .build()

  const transactionHandler = txCb(
    (blockHash) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success,
      )

      isLoading.value = false
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.warn)
      isLoading.value = false
    },
  )

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    isLoading.value = false
  }

  isLoading.value = true

  const injector = await getAddress(toDefaultAddress(accountId.value))
  call
    .signAndSend(
      accountId.value,
      { signer: injector.signer },
      transactionHandler,
    )
    .catch(errorHandler)
}
</script>

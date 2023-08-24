<template>
  <section class="is-flex is-justify-content-center">
    <div
      :class="[
        'transfer-card',
        {
          'theme-background-color k-shadow border py-8 px-6': !isMobile,
        },
      ]">
      <Loader v-model="isLoading" :status="status" />
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <p class="has-text-weight-bold is-size-3">
          {{ $t('transfer') }} {{ unit }}
        </p>
        <NeoDropdown position="bottom-left" :mobile-modal="false">
          <template #trigger="{ active }">
            <NeoButton
              icon="ellipsis-vertical"
              no-shadow
              class="square-32"
              :active="active" />
          </template>

          <NeoDropdownItem
            v-clipboard:copy="generatePaymentLink(accountId)"
            @click="toast(`${$i18n.t('toast.urlCopy')}`)">
            <NeoIcon icon="sack-dollar" pack="fa" class="mr-2" />{{
              $t('transfers.payMeLink')
            }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>

      <TransferTokenTabs
        :tabs="tokenTabs"
        :value="unit"
        @select="handleTokenSelect" />

      <div class="is-flex is-justify-content-space-between">
        <div class="is-flex is-flex-direction-column">
          <span class="has-text-weight-bold is-size-6 mb-1">{{
            $t('transfers.sender')
          }}</span>
          <div v-if="accountId" class="is-flex is-align-items-center">
            <Avatar :value="accountId" :size="32" />
            <span class="ml-2">
              <Identity :address="accountId" hide-identity-popover />
            </span>
            <a
              v-clipboard:copy="accountId"
              class="ml-2"
              @click="toast(`${$i18n.t('general.copyToClipboard')}`)">
              <NeoIcon icon="copy" />
            </a>
          </div>
          <Auth v-else />
        </div>
        <div class="is-flex is-flex-direction-column is-align-items-end">
          <span class="has-text-weight-bold is-size-6 mb-1">{{
            $t('general.balance')
          }}</span>
          <div class="is-flex is-align-items-center">
            <img class="mr-2 is-32x32" :src="tokenIcon" alt="token" />
            <Money
              :value="balance"
              :unit-symbol="unit"
              :decimals="decimals"
              inline />
          </div>

          <span class="has-text-grey">≈ ${{ balanceUsdValue }}</span>
        </div>
      </div>

      <hr />

      <div v-if="!isMobile" class="is-flex">
        <div class="has-text-weight-bold is-size-6 mb-3 is-flex-1 mr-2">
          {{ $t('transfers.recipient') }}
        </div>
        <div class="has-text-weight-bold is-size-6 mb-3 is-flex-1">
          {{ $t('amount') }}
        </div>
      </div>
      <div class="is-flex-grow-1 is-flex-direction-column">
        <div
          v-for="(destinationAddress, index) in targetAddresses"
          :key="index"
          class="mb-3">
          <div v-if="isMobile" class="has-text-weight-bold is-size-6 mb-3">
            {{ $t('transfers.recipient') }} {{ index + 1 }}
          </div>
          <div
            :class="[
              'is-flex',
              {
                'is-flex-direction-column': isMobile,
              },
            ]">
            <AddressInput
              v-model="destinationAddress.address"
              label=""
              class="is-flex-1"
              :class="[
                {
                  'mr-2': !isMobile,
                  'mb-2': isMobile,
                },
              ]"
              placeholder="Enter wallet address"
              :strict="false" />
            <NeoInput
              v-if="displayUnit === 'token'"
              v-model="destinationAddress.token"
              type="number"
              placeholder="0"
              step="0.01"
              min="0"
              icon-right-class="search"
              class="is-flex-1"
              @input="onAmountFieldChange(destinationAddress)" />
            <NeoInput
              v-else
              v-model="destinationAddress.usd"
              placeholder="0"
              type="number"
              step="0.01"
              min="0"
              icon-right-class="search"
              class="is-flex-1"
              @input="onUsdFieldChange(destinationAddress)" />
          </div>
        </div>
      </div>

      <div
        class="mb-5 is-flex is-justify-content-center is-clickable"
        @click="addAddress">
        {{ $t('transfers.addAddress') }}
        <NeoIcon class="ml-2" icon="plus" pack="fas" />
      </div>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center">
          {{ $t('transfers.sendSameAmount')
          }}<NeoTooltip :label="$t('transfers.setSameAmount')"
            ><NeoIcon class="ml-2" icon="circle-info" pack="far"
          /></NeoTooltip>
        </div>
        <NeoSwitch v-model="sendSameAmount" :rounded="false" />
      </div>

      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <span class="has-text-weight-bold is-size-6">{{
          $t('transfers.displayUnit')
        }}</span>
        <div class="is-flex is-align-items-center">
          <span class="is-size-6 mr-1"
            >{{ $t('transfers.transferable') }}:
          </span>
          <span
            v-if="displayUnit === 'token'"
            class="has-text-weight-bold is-size-6">
            <Money
              :value="balance"
              :unit-symbol="unit"
              :decimals="decimals"
              inline />
          </span>
          <span v-else class="has-text-weight-bold is-size-6"
            >{{ balanceUsdValue }} USD</span
          >
        </div>
      </div>

      <div
        class="is-flex field has-addons is-flex-grow-1 is-justify-content-center mb-4">
        <TabItem
          :active="displayUnit === 'token'"
          :text="unit"
          tag="button"
          full-width
          no-shadow
          @click.native="displayUnit = 'token'" />
        <TabItem
          :active="displayUnit === 'usd'"
          text="USD"
          tag="button"
          full-width
          no-shadow
          @click.native="displayUnit = 'usd'" />
      </div>

      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-6">
        <span class="has-text-weight-bold is-size-6">{{
          $t('spotlight.total')
        }}</span>
        <div class="is-flex is-align-items-center">
          <span class="is-size-7 has-text-grey mr-1"
            >({{ displayTotalValue[0] }})</span
          >

          <span class="has-text-weight-bold is-size-6">{{
            displayTotalValue[1]
          }}</span>
        </div>
      </div>

      <div class="is-flex">
        <NeoButton
          class="is-flex is-flex-1 fixed-height"
          variant="k-accent"
          :disabled="disabled"
          @click.native="handleOpenConfirmModal"
          >{{ $t('redirect.continue') }}</NeoButton
        >
      </div>
      <TransferConfirmModal
        :is-modal-active="isTransferModalVisible"
        :display-total-value="displayTotalValue"
        :token-icon="tokenIcon"
        :unit="unit"
        :is-mobile="isMobile"
        :target-addresses="targetAddresses"
        @close="isTransferModalVisible = false"
        @confirm="submit" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import Connector from '@kodadot1/sub-api'
import { ALTERNATIVE_ENDPOINT_MAP } from '@kodadot1/static'

import { isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'

import {
  calculateTokenFromUsd,
  calculateUsdFromToken,
} from '@/utils/calculation'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  calculateBalance,
  calculateBalanceUsdValue,
} from '@/utils/format/balance'
import { getNumberSumOfObjectField } from '@/utils/math'
import { useFiatStore } from '@/stores/fiat'
import Avatar from '@/components/shared/Avatar.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import { getMovedItemToFront } from '@/utils/objects'
import TransferConfirmModal from '@/components/transfer/TransferConfirmModal.vue'

import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
  NeoInput,
  NeoSwitch,
  NeoTooltip,
} from '@kodadot1/brick'
import TransferTokenTabs, { TransferTokenTab } from './TransferTokenTabs.vue'
import { TokenDetails } from '@/composables/useToken'
import { ApiPromise } from '@polkadot/api'
const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const route = useRoute()
const router = useRouter()
const { $consola, $i18n } = useNuxtApp()
const { unit: chainUnit } = useChain()
const { apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const { initTransactionLoader, isLoading, resolveStatus, status } =
  useTransactionStatus()
const { getBalance } = useBalance()
const { toast } = useToast()
const isTransferModalVisible = ref(false)

export type TargetAddress = {
  address?: string
  usd?: number | string
  token?: number | string
}
const isMobile = computed(() => useWindowSize().width.value <= 1024)

const transactionValue = ref('')
const sendSameAmount = ref(false)
const displayUnit = ref<'token' | 'usd'>('token')
const { getTokenIconBySymbol } = useIcon()

const { tokens, isTokenValidForChain } = useToken()
const unit = ref(chainUnit.value)
const selectedToken = computed(() =>
  tokens.value.find((t) => t.symbol === unit.value)
)
const decimals = computed(
  () => selectedToken.value?.tokenDecimals[urlPrefix.value]
)

const selectedTabFirst = ref(true)
const tokenIcon = computed(() => getTokenIconBySymbol(unit.value))

const tokenTabs = ref<TransferTokenTab[]>([])

const targetAddresses = ref<TargetAddress[]>([{}])

const hasValidTarget = computed(() =>
  targetAddresses.value.some((item) => isAddress(item.address) && item.token)
)

const displayTotalValue = computed(() =>
  displayUnit.value === 'token'
    ? [`$${totalUsdValue.value}`, `${totalTokenAmount.value} ${unit.value}`]
    : [`${totalTokenAmount.value} ${unit.value}`, `$${totalUsdValue.value}`]
)

const balance = computed(() => getBalance(unit.value) || 0)

const disabled = computed(
  () =>
    !isLogIn.value ||
    balanceUsdValue.value < totalUsdValue.value ||
    !hasValidTarget.value
)

const handleTokenSelect = (newToken: string) => {
  selectedTabFirst.value = false

  const token = tokens.value.find((t) => t.symbol === newToken)

  if (!token) {
    return
  }

  const isTokenAvailableForCurrentChain = isTokenValidForChain(
    token.symbol,
    urlPrefix.value
  )

  if (isTokenAvailableForCurrentChain) {
    unit.value = token.symbol
    return
  }

  router.replace({
    params: { prefix: token.defaultChain },
    query: { ...route.query, token: token.symbol },
  })
}

const generateTokenTabs = (
  items: TokenDetails[],
  selectedToken: string,
  sort = false
) => {
  items = sort ? getMovedItemToFront(items, 'symbol', selectedToken) : items

  return items.map((availableToken) => ({
    label: `${availableToken.symbol} $${availableToken.value || '0'}`,
    icon: availableToken.icon,
    value: availableToken.symbol,
  }))
}

watch(
  tokens,
  (items) => {
    tokenTabs.value = generateTokenTabs(
      items,
      unit.value,
      selectedTabFirst.value
    )
  },
  { immediate: true }
)

const checkQueryParams = () => {
  const { query } = route
  const targets = Object.entries(query)
    .filter(([key]) => key.startsWith('target'))
    .filter(([_, address]) => {
      if (isAddress(address as string)) {
        return true
      }
      showNotification(
        `Unable to use target address ${address}`,
        notificationTypes.warn
      )
      return false
    })
    .map(([_, address]) => address as string)
  if (targets.length > 0) {
    targetAddresses.value = targets.map((address) => ({
      address,
    }))
  }

  if (query.amount) {
    sendSameAmount.value = true
    targetAddresses.value = targetAddresses.value.map((address) => ({
      ...address,
      token: Number(query.amount),
    }))
  } else if (query.usdamount) {
    const usdValue = Number(query.usdamount)
    const tokenAmount = calculateTokenFromUsd(
      Number(getCurrentTokenValue(unit.value)),
      usdValue
    )
    sendSameAmount.value = true

    targetAddresses.value = targetAddresses.value.map((address) => ({
      ...address,
      usd: usdValue,
      token: tokenAmount,
    }))
  }
}

watch(sendSameAmount, (value) => {
  if (value) {
    const tokenAmount = targetAddresses.value[0]?.token
    const usdAmount = targetAddresses.value[0]?.usd
    targetAddresses.value = targetAddresses.value.map((address) => ({
      ...address,
      token: tokenAmount,
      usd: usdAmount,
    }))
  }
})

const totalTokenAmount = computed(() =>
  Number(
    Number(getNumberSumOfObjectField(targetAddresses.value, 'token')).toFixed(4)
  )
)
const totalUsdValue = computed(() =>
  calculateUsdFromToken(totalTokenAmount.value, Number(currentTokenValue.value))
)

const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))
const balanceUsdValue = computed(() =>
  calculateBalanceUsdValue(
    Number(balance.value) * Number(currentTokenValue.value),
    decimals.value
  )
)

const onAmountFieldChange = (target: TargetAddress) => {
  /* calculating usd value on the basis of price entered */

  target.usd = target.token
    ? calculateUsdFromToken(
        Number(getCurrentTokenValue(unit.value)),
        Number(target.token)
      )
    : 0

  // update targetAddresses
  targetAddresses.value = [...targetAddresses.value]

  if (sendSameAmount.value) {
    unifyAddressAmount(target)
  }
}

const onUsdFieldChange = (target: TargetAddress) => {
  /* calculating price value on the basis of usd entered */
  target.token = target.usd
    ? calculateTokenFromUsd(
        Number(getCurrentTokenValue(unit.value)),
        Number(target.usd)
      )
    : 0

  // update targetAddresses
  targetAddresses.value = [...targetAddresses.value]

  if (sendSameAmount.value) {
    unifyAddressAmount(target)
  }
}

const unifyAddressAmount = (target: TargetAddress) => {
  targetAddresses.value = targetAddresses.value.map((address) => ({
    ...address,
    token: target.token,
    usd: target.usd,
  }))
}

const updateTargetAdressesOnTokenSwitch = () => {
  targetAddresses.value.forEach((targetAddress) => {
    if (displayUnit.value === 'usd') {
      onUsdFieldChange(targetAddress)
    } else {
      onAmountFieldChange(targetAddress)
    }
  })
}

watch(
  unit,
  () => {
    updateTargetAdressesOnTokenSwitch()
  },
  { immediate: true }
)

const handleOpenConfirmModal = () => {
  if (!disabled.value) {
    targetAddresses.value = targetAddresses.value.filter(
      (address) => address.address && address.token && address.usd
    )
    isTransferModalVisible.value = true
  }
}

const getAmountToTransfer = (amount: number, decimals: number) =>
  String(calculateBalance(Number(amount), decimals))

interface TransferParams {
  api: ApiPromise
  decimals: number
  tokenTransfer: boolean
  tokenId: string
}

const getMultipleAddressesTransferParams = ({
  api,
  decimals,
  tokenTransfer,
  tokenId,
}: TransferParams) => {
  const arg = [
    targetAddresses.value.map((target) => {
      const amountToTransfer = getAmountToTransfer(
        target.token as number,
        decimals
      )

      if (tokenTransfer) {
        return api.tx.tokens.transfer(target.address, tokenId, amountToTransfer)
      }

      return api.tx.balances.transfer(
        target.address as string,
        amountToTransfer
      )
    }),
  ]

  return [api.tx.utility.batch, arg]
}

const getSingleAddressTransferParams = ({
  api,
  decimals,
  tokenTransfer,
  tokenId,
}: TransferParams) => {
  const target = targetAddresses.value[0]

  const amountToTransfer = getAmountToTransfer(target.token as number, decimals)

  if (tokenTransfer) {
    return [api.tx.tokens.transfer, [target.address, tokenId, amountToTransfer]]
  }

  return [
    api.tx.balances.transfer,
    [target.address as string, amountToTransfer],
  ]
}

const submit = async (
  event: any,
  usedNodeUrls: string[] = []
): Promise<void> => {
  showNotification(`${route.query.target ? 'Sent for Sign' : 'Dispatched'}`)
  isTransferModalVisible.value = false
  initTransactionLoader()
  try {
    const api = await apiInstance.value

    const tokenId = selectedToken.value?.tokenIds[urlPrefix.value] || null
    const tokenTransfer = !!tokenId

    const numOfTargetAddresses = targetAddresses.value.length
    const multipleAddresses = numOfTargetAddresses > 1

    let cb, arg

    if (multipleAddresses) {
      ;[cb, arg] = getMultipleAddressesTransferParams({
        api,
        tokenId: tokenId as string,
        tokenTransfer,
        decimals: decimals.value as number,
      })
    } else {
      ;[cb, arg] = getSingleAddressTransferParams({
        api,
        tokenId: tokenId as string,
        tokenTransfer,
        decimals: decimals.value as number,
      })
    }

    const tx = await exec(
      accountId.value,
      '',
      cb,
      arg,
      txCb(
        async (blockHash) => {
          transactionValue.value = execResultValue(tx)
          const header = await api.rpc.chain.getHeader(blockHash)
          const blockNumber = header.number.toString()

          showNotification(
            `[${unit.value}] Transfered ${totalTokenAmount.value} ${unit.value} in block ${blockNumber}`,
            notificationTypes.success
          )

          targetAddresses.value = [{}]
          if (route.query && !route.query.donation) {
            router.push(route.path)
          }

          isLoading.value = false
        },
        (dispatchError) => {
          execResultValue(tx)
          onTxError(dispatchError)
          isLoading.value = false
        },
        (res) => resolveStatus(res.status)
      )
    )
  } catch (e: any) {
    if (e.message === 'Cancelled') {
      showNotification(e.message, notificationTypes.warn)
      isLoading.value = false
      return
    }

    const availableUrls = ALTERNATIVE_ENDPOINT_MAP[urlPrefix.value]
    if (usedNodeUrls.length < availableUrls.length) {
      const nextTryUrls = availableUrls.filter(
        (url) => !usedNodeUrls.includes(url)
      )
      const { getInstance: Api } = Connector
      // try to connect next possible url
      await Api().connect(nextTryUrls[0])
      submit(event, [nextTryUrls[0], ...usedNodeUrls])
    }

    if (e instanceof Error) {
      $consola.error('[ERR: TRANSFER SUBMIT]', e)
      showNotification(e.toString(), notificationTypes.warn)
      isLoading.value = false
    }
  }
}

const onTxError = async (dispatchError: DispatchError): Promise<void> => {
  const api = await apiInstance.value
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule)
    const { docs, name, section } = decoded
    showNotification(
      `[ERR] ${section}.${name}: ${docs.join(' ')}`,
      notificationTypes.warn
    )
  } else {
    showNotification(
      `[ERR] ${dispatchError.toString()}`,
      notificationTypes.warn
    )
  }

  isLoading.value = false
}

const generatePaymentLink = (address): string => {
  const addressQueryString = `target=${address}`
  return `${window.location.origin}/${urlPrefix.value}/transfer?${addressQueryString}&usdamount=${totalUsdValue.value}&donation=true`
}

const addAddress = () => {
  targetAddresses.value.push({
    ...(sendSameAmount.value ? targetAddresses.value[0] : {}),
    address: '',
  })
}

const syncQueryToken = () => {
  const token = route.query.token?.toString()

  if (!isTokenValidForChain(token, urlPrefix.value)) {
    return
  }

  unit.value = token
}

watch(
  route,
  () => {
    syncQueryToken()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  fetchFiatPrice().then(checkQueryParams)
})

watchDebounced(
  () => targetAddresses.value[0].usd,
  (usdamount) => {
    router
      .replace({
        query: {
          ...route.query,
          usdamount: (usdamount || 0).toString(),
          token: unit.value,
        },
      })
      .catch(() => null) // null to further not throw navigation errors
  },
  { debounce: 300 }
)
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.transfer-card {
  max-width: 41rem;

  @include touch {
    width: 100vw;
  }

  .square-32 {
    width: 32px;
    height: 32px;
  }

  .fixed-height {
    height: 51px;
  }
}
</style>

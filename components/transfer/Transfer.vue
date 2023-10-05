<template>
  <section class="is-flex is-justify-content-center">
    <div
      :class="[
        'transfer-card',
        'w-100',
        {
          'theme-background-color k-shadow border py-8 px-7': !isMobile,
        },
      ]">
      <TransactionLoader
        v-model="isLoaderModalVisible"
        :status="status"
        :total-token-amount="totalTokenAmount"
        :transaction-id="transactionValue"
        :total-usd-value="totalUsdValue"
        :is-mobile="isMobile"
        @close="isLoaderModalVisible = false" />
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <p class="has-text-weight-bold is-size-3">
          {{ $t('transfer') }} {{ unit }}
        </p>
        <NeoDropdown
          position="bottom-left"
          :mobile-modal="false"
          menu-class="is-shadowless no-border-bottom">
          <template #trigger="{ active }">
            <NeoButton
              icon="ellipsis-vertical"
              no-shadow
              class="square-32"
              data-testid="transfer-button-options"
              :active="active" />
          </template>

          <NeoDropdownItem
            v-if="accountId"
            v-clipboard:copy="generatePaymentLink([accountId])"
            data-testid="transfer-dropdown-pay-me"
            @click="toast($t('toast.urlCopy'))">
            <NeoIcon icon="sack-dollar" class="mr-2" />{{
              $t('transfers.payMeLink')
            }}
          </NeoDropdownItem>

          <NeoDropdownItem
            v-clipboard:copy="generateRecurringPaymentLink()"
            class="no-wrap"
            data-testid="transfer-dropdown-recurring"
            @click="toast($t('toast.urlCopy'))">
            <NeoIcon icon="rotate" class="mr-2" />{{
              $t('transfers.recurringPaymentLink')
            }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>

      <PillTabs :tabs="tokenTabs" @select="handleTokenSelect" />

      <div class="mb-5">
        <NeoIcon class="ml-2" icon="circle-info" />
        <span
          v-dompurify-html="
            $t('transfers.tooltip', [unit, chainNames[urlPrefix]])
          "></span>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <div class="is-flex is-flex-direction-column">
          <span class="has-text-weight-bold is-size-6 mb-1">{{
            $t('transfers.sender')
          }}</span>
          <div v-if="accountId" class="is-flex is-align-items-center">
            <Avatar
              :value="accountId"
              :size="32"
              data-testid="transfer-sender-full-address" />
            <span class="ml-2">
              <Identity
                :address="accountId"
                hide-identity-popover
                data-testid="transfer-sender-address" />
            </span>
            <a
              v-clipboard:copy="accountId"
              class="ml-2"
              data-testid="transfer-copy-sender-address"
              @click="toast($t('general.copyToClipboard'))">
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
            <Money :value="balance" inline />
          </div>

          <span class="has-text-grey">≈ ${{ balanceUsdValue }}</span>
        </div>
      </div>

      <hr />

      <div v-if="!isMobile" class="is-flex">
        <div
          class="has-text-weight-bold is-size-6 mb-3 is-flex-1 mr-2 is-flex-grow-2">
          {{ $t('transfers.recipient') }}
        </div>
        <div
          class="has-text-weight-bold is-size-6 mb-3 is-flex-1 is-flex-grow-1">
          {{ $t('amount') }}
        </div>
      </div>
      <div class="is-flex-grow-1 is-flex-direction-column">
        <div
          v-for="(destinationAddress, index) in targetAddresses"
          :key="index"
          class="mb-3">
          <div
            v-if="isMobile"
            class="has-text-weight-bold is-size-6 mb-3 is-flex is-align-items-center is-justify-content-space-between">
            {{ $t('transfers.recipient') }} {{ index + 1 }}
            <a v-if="targetAddresses.length > 1" @click="deleteAddress(index)">
              <NeoIcon class="p-3" icon="trash" />
            </a>
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
              class="is-flex-1 is-flex-grow-2"
              :class="[
                {
                  'mr-2': !isMobile,
                  'mb-2': isMobile,
                },
              ]"
              :strict="false"
              :is-invalid="isTargetAddressInvalid(destinationAddress)"
              placeholder="Enter wallet address"
              disable-error />
            <div
              class="is-flex-1"
              :class="{ 'is-flex is-flex-grow-1': !isMobile }">
              <NeoInput
                v-if="displayUnit === 'token'"
                v-model="destinationAddress.token"
                type="number"
                placeholder="0"
                step="0.01"
                min="0"
                icon-right-class="search"
                data-testid="transfer-input-amount-token"
                @focus="onAmountFieldFocus(destinationAddress, 'token')"
                @update:modelValue="onAmountFieldChange(destinationAddress)" />
              <NeoInput
                v-else
                v-model="destinationAddress.usd"
                placeholder="0"
                type="number"
                step="0.01"
                min="0"
                icon-right="usd"
                icon-right-class="has-text-grey"
                data-testid="transfer-input-amount-usd"
                @focus="onAmountFieldFocus(destinationAddress, 'usd')"
                @update:modelValue="onUsdFieldChange(destinationAddress)" />
              <a
                v-if="!isMobile && targetAddresses.length > 1"
                class="is-flex"
                data-testid="transfer-remove-recipient"
                @click="deleteAddress(index)">
                <NeoIcon class="p-3" icon="trash" />
              </a>
            </div>
          </div>
          <div class="mt-2">
            <AddressChecker
              :address="destinationAddress.address"
              @check="
                (isValid) => handleAddressCheck(destinationAddress, isValid)
              "
              @change="
                (address) => handleAddressChange(destinationAddress, address)
              " />
          </div>
        </div>
      </div>

      <div
        class="mb-5 is-flex is-justify-content-center is-clickable"
        data-testid="transfer-icon-add-recipient"
        @click="addAddress">
        {{ $t('transfers.addAddress') }}
        <NeoIcon class="ml-2" icon="plus" />
      </div>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center">
          {{ $t('transfers.sendSameAmount') }}
          <!-- tips: don't use `margin` or `padding` directly on the tooltip trigger, it will cause misalignment of the tooltip -->
          <span class="mr-2" />
          <NeoTooltip :label="$t('transfers.setSameAmount')"
            ><NeoIcon icon="circle-info"
          /></NeoTooltip>
        </div>
        <NeoSwitch
          v-model="sendSameAmount"
          :rounded="false"
          data-testid="transfer-switch-same" />
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
            <Money :value="balance" inline />
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
          data-testid="transfer-tab-token"
          @click="displayUnit = 'token'" />
        <TabItem
          :active="displayUnit === 'usd'"
          text="USD"
          tag="button"
          full-width
          no-shadow
          data-testid="transfer-tab-usd"
          @click="displayUnit = 'usd'" />
      </div>

      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <span class="is-size-7">{{ $t('transfers.networkFee') }}</span>
        <div
          class="is-flex is-align-items-center"
          data-testid="transfer-network-fee">
          <span class="is-size-7 has-text-grey mr-1"
            >({{ displayTxFeeValue[0] }})</span
          >
          <span class="is-size-7">{{ displayTxFeeValue[1] }}</span>
        </div>
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

          <span
            class="has-text-weight-bold is-size-6"
            data-testid="transfer-total-amount"
            >{{ displayTotalValue[1] }}</span
          >
        </div>
      </div>

      <div class="is-flex">
        <NeoButton
          class="is-flex is-flex-1 fixed-height is-shadowless"
          variant="k-accent"
          :disabled="disabled"
          @click="handleOpenConfirmModal"
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
import { ApiFactory } from '@kodadot1/sub-api'
import { ALTERNATIVE_ENDPOINT_MAP, chainNames } from '@kodadot1/static'

import { isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'

import {
  calculateExactUsdFromToken,
  calculateTokenFromUsd,
  calculateUsdFromToken,
} from '@/utils/calculation'
import exec, {
  estimate,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
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
import PillTabs, { PillTab } from '@/components/shared/PillTabs.vue'
import { TokenDetails } from '@/composables/useToken'
import AddressInput from '@/components/shared/AddressInput.vue'
import TransactionLoader from '@/components/shared/TransactionLoader.vue'
import { KODADOT_DAO } from '@/utils/support'
import { toDefaultAddress } from '@/utils/account'
import AddressChecker from '@/components/shared/AddressChecker.vue'
import TabItem from '@/components/shared/TabItem.vue'
import Auth from '@/components/shared/Auth.vue'

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue'),
)

const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()
const { unit, decimals } = useChain()
const { apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()
const { getBalance } = useBalance()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const { initTransactionLoader, isLoading, resolveStatus, status } =
  useTransactionStatus()
const { toast } = useToast()
const isTransferModalVisible = ref(false)
const isLoaderModalVisible = ref(false)

watch(isLoading, (newValue, oldValue) => {
  // trigger modal only when loading change from false => true
  // we want to keep modal open when loading changes true => false
  if (newValue && !oldValue) {
    isLoaderModalVisible.value = isLoading.value
  }
})

export type TargetAddress = {
  address: string
  usd?: number | string
  token?: number | string
  isInvalid?: boolean
}
const isMobile = computed(() => useWindowSize().width.value <= 764)
const balance = computed(() => getBalance(unit.value) || 0)

const transactionValue = ref('')
const sendSameAmount = ref(false)
const displayUnit = ref<'token' | 'usd'>('token')
const { getTokenIconBySymbol } = useIcon()

const { tokens } = useToken()

const selectedTabFirst = ref(true)
const tokenIcon = computed(() => getTokenIconBySymbol(unit.value))

const tokenTabs = ref<PillTab[]>([])

const targetAddresses = ref<TargetAddress[]>([{ address: '' }])

const hasValidTarget = computed(() =>
  targetAddresses.value.some(
    (item) => isAddress(item.address) && !item.isInvalid && item.token,
  ),
)

const getDisplayUnitBasedValues = (
  usdValue: number,
  tokenAmount: number,
): [string, string] => {
  return displayUnit.value === 'token'
    ? [`$${usdValue}`, `${tokenAmount} ${unit.value}`]
    : [`${tokenAmount} ${unit.value}`, `$${usdValue}`]
}

const displayTotalValue = computed(() =>
  getDisplayUnitBasedValues(totalUsdValue.value, totalTokenAmount.value),
)

const txFee = ref<number>(0)

const txFeeUsdValue = computed(() =>
  calculateExactUsdFromToken(txFee.value, Number(currentTokenValue.value)),
)

const displayTxFeeValue = computed(() =>
  getDisplayUnitBasedValues(txFeeUsdValue.value, txFee.value),
)

const disabled = computed(
  () =>
    !isLogIn.value ||
    balanceUsdValue.value < totalUsdValue.value ||
    !hasValidTarget.value,
)

const handleTokenSelect = (newToken: string) => {
  selectedTabFirst.value = false

  const token = tokens.value.find((t) => t.symbol === newToken)

  if (!token) {
    return
  }

  routerReplace({
    params: { prefix: token.defaultChain },
  })
}

const generateTokenTabs = (
  items: TokenDetails[],
  selectedToken: string,
  sort = false,
) => {
  items = sort ? getMovedItemToFront(items, 'symbol', selectedToken) : items

  return items.map(
    (availableToken) =>
      ({
        label: `${availableToken.symbol} $${availableToken.value || '0'}`,
        image: availableToken.icon,
        value: availableToken.symbol,
        active: unit.value === availableToken.symbol,
      }) as PillTab,
  )
}

watch(
  tokens,
  (items) => {
    tokenTabs.value = generateTokenTabs(
      items,
      unit.value,
      selectedTabFirst.value,
    )
  },
  { immediate: true },
)

const checkQueryParams = () => {
  const { query } = route
  const targets = Object.entries(query)
    .filter(([key]) => key.startsWith('target'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, address]) => {
      if (isAddress(address as string)) {
        return true
      }
      showNotification(
        `Unable to use target address ${address}`,
        notificationTypes.warn,
      )
      return false
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, address]) => address as string)
  if (targets.length > 0) {
    targetAddresses.value = targets.map((address) => ({
      address,
    }))
  }

  if (query.amount) {
    const tokenAmount = Number(query.amount)
    const usdValue = calculateUsdFromToken(
      tokenAmount,
      Number(currentTokenValue.value),
    )

    sendSameAmount.value = true
    targetAddresses.value = targetAddresses.value.map((address) => ({
      ...address,
      usd: usdValue,
      token: tokenAmount,
    }))
  } else if (query.usdamount) {
    const usdValue = Number(query.usdamount)
    const tokenAmount = calculateTokenFromUsd(
      Number(getCurrentTokenValue(unit.value)),
      usdValue,
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
    Number(getNumberSumOfObjectField(targetAddresses.value, 'token')).toFixed(
      4,
    ),
  ),
)
const totalUsdValue = computed(() =>
  calculateUsdFromToken(
    totalTokenAmount.value,
    Number(currentTokenValue.value),
  ),
)

const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))
const balanceUsdValue = computed(() =>
  calculateBalanceUsdValue(
    Number(balance.value) * Number(currentTokenValue.value),
    decimals.value,
  ),
)

const onAmountFieldChange = (target: TargetAddress) => {
  /* calculating usd value on the basis of price entered */

  target.usd = target.token
    ? calculateUsdFromToken(
        Number(getCurrentTokenValue(unit.value)),
        Number(target.token),
      )
    : 0

  // update targetAddresses
  targetAddresses.value = [...targetAddresses.value]

  if (sendSameAmount.value) {
    unifyAddressAmount(target)
  }
}

const onAmountFieldFocus = (target: TargetAddress, field: 'usd' | 'token') => {
  if (Number(target[field]) === 0) {
    target[field] = ''
  }
}

const onUsdFieldChange = (target: TargetAddress) => {
  /* calculating price value on the basis of usd entered */
  target.token = target.usd
    ? calculateTokenFromUsd(
        Number(getCurrentTokenValue(unit.value)),
        Number(target.usd),
      )
    : 0

  // update targetAddresses
  targetAddresses.value = [...targetAddresses.value]

  if (sendSameAmount.value) {
    unifyAddressAmount(target)
  }
}

const handleAddressCheck = (target: TargetAddress, isValid: boolean) => {
  target.isInvalid = !isValid

  targetAddresses.value = [...targetAddresses.value]
}

const handleAddressChange = (target: TargetAddress, newAddress: string) => {
  target.address = newAddress

  targetAddresses.value = [...targetAddresses.value]
}

const isTargetAddressInvalid = (target: TargetAddress) => {
  return target.isInvalid === undefined ? false : target.isInvalid
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
    onUsdFieldChange(targetAddress)
  })
}

watch(
  unit,
  () => {
    updateTargetAdressesOnTokenSwitch()
  },
  { immediate: true },
)

const handleOpenConfirmModal = () => {
  if (!disabled.value) {
    targetAddresses.value = targetAddresses.value.filter(
      (address) => address.address && address.token && address.usd,
    )
    isTransferModalVisible.value = true
  }
}

const getTransactionFee = async () => {
  const { cb, arg } = await getTransferParams(
    targetAddresses.value.map(
      () =>
        ({
          address: toDefaultAddress(KODADOT_DAO),
          usd: 1,
          token: 1,
        }) as TargetAddress,
    ),
    decimals.value as number,
  )

  return estimate(accountId.value, cb as any, arg as any)
}

const calculateTransactionFee = async () => {
  txFee.value = 0
  const fee = await getTransactionFee()
  txFee.value = Number((Number(fee) / Math.pow(10, decimals.value)).toFixed(4))
}

onMounted(() => calculateTransactionFee())

watchDebounced(
  [urlPrefix, () => targetAddresses.value.length],
  () => {
    calculateTransactionFee()
  },
  { debounce: 500 },
)

const getAmountToTransfer = (amount: number, decimals: number) =>
  String(calculateBalance(Number(amount), decimals))

const getTransferParams = async (
  addresses: TargetAddress[],
  decimals: number,
) => {
  const api = await apiInstance.value
  const isSingle = targetAddresses.value.length === 1

  const firstAddress = addresses[0]

  const cb = isSingle ? api.tx.balances.transfer : api.tx.utility.batch
  const arg = isSingle
    ? [
        firstAddress.address as string,
        getAmountToTransfer(firstAddress.token as number, decimals),
      ]
    : [
        addresses.map((target) => {
          const amountToTransfer = getAmountToTransfer(
            target.token as number,
            decimals,
          )

          return api.tx.balances.transfer(
            target.address as string,
            amountToTransfer,
          )
        }),
      ]

  return { cb, arg }
}

const submit = async (
  event: any,
  usedNodeUrls: string[] = [],
): Promise<void> => {
  isTransferModalVisible.value = false
  initTransactionLoader()
  try {
    const { cb, arg } = await getTransferParams(
      targetAddresses.value,
      decimals.value as number,
    )

    const tx = await exec(
      accountId.value,
      '',
      cb,
      arg,
      txCb(
        () => {
          transactionValue.value = execResultValue(tx)

          targetAddresses.value = [{ address: '' }]

          // not sure what is the purpose of this
          // but it causes the explorer url in Transaction Loader to become wrong
          // after the transaction is finalized
          // also causes:
          //https://github.com/kodadot/nft-gallery/issues/6944

          // if (route.query && !route.query.donation) {
          //    router.push(route.path)
          // }

          isLoading.value = false
        },
        (dispatchError) => {
          execResultValue(tx)
          onTxError(dispatchError)
          isLoading.value = false
        },
        (res) => resolveStatus(res.status),
      ),
    )
  } catch (e: any) {
    if (e.message === 'Cancelled') {
      showNotification(e.message, notificationTypes.warn)
      isLoading.value = false
      isLoaderModalVisible.value = false
      return
    }

    const availableUrls = ALTERNATIVE_ENDPOINT_MAP[urlPrefix.value]
    if (usedNodeUrls.length < availableUrls.length) {
      const nextTryUrls = availableUrls.filter(
        (url) => !usedNodeUrls.includes(url),
      )
      // try to connect next possible url
      await ApiFactory.useApiInstance(nextTryUrls[0])
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
      notificationTypes.warn,
    )
  } else {
    showNotification(
      `[ERR] ${dispatchError.toString()}`,
      notificationTypes.warn,
    )
  }

  isLoading.value = false
}

const generateRecurringPaymentLink = () => {
  const addressList = targetAddresses.value
    .filter((item) => isAddress(item.address) && !item.isInvalid)
    .map((item) => item.address)

  return generatePaymentLink(addressList)
}

const generatePaymentLink = (addressList: string[]): string => {
  const url = new URL(`${location.origin}${location.pathname}`)
  addressList.forEach((addr, i) => {
    url.searchParams.append(`target${i == 0 ? '' : i}`, addr)
  })
  url.searchParams.append(
    'usdamount',
    String(targetAddresses.value[0]?.usd || 0),
  )

  return url.toString()
}

const addAddress = () => {
  targetAddresses.value.push({
    ...(sendSameAmount.value ? targetAddresses.value[0] : {}),
    address: '',
  })
}

const deleteAddress = (index: number) => {
  targetAddresses.value.splice(index, 1)
}

onMounted(() => {
  fetchFiatPrice().then(checkQueryParams)
})

const routerReplace = ({ params = {}, query = {} }) => {
  router
    .replace({
      params: params,
      query: {
        ...route.query,
        ...query,
      },
    })
    .catch(() => null) // null to further not throw navigation errors
}

watchDebounced(
  () => targetAddresses.value[0]?.usd,
  (usdamount) => {
    routerReplace({ query: { usdamount: (usdamount || 0).toString() } })
  },
  { debounce: 300 },
)
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.transfer-card {
  max-width: 660px;

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
:deep(.o-drop__menu.no-border-bottom) {
  border-bottom: none;
}
</style>

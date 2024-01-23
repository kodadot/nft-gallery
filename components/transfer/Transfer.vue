<template>
  <section class="flex justify-center">
    <div
      :class="[
        'transfer-card',
        'w-full',
        {
          'bg-background-color k-shadow border py-8 px-7': !isMobile,
        },
      ]">
      <TransactionLoader
        v-model="isLoaderModalVisible"
        :status="status"
        :total-token-amount="
          withoutDecimals({ value: totalValues.withoutFee.token })
        "
        :unit="unit"
        :transaction-id="transactionValue"
        :total-usd-value="totalValues.withoutFee.usd"
        :is-mobile="isMobile"
        @close="isLoaderModalVisible = false" />
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold is-size-3">{{ $t('transfer') }} {{ unit }}</p>
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
            v-clipboard:copy="generatePaymentLink([targetAddresses[0]])"
            data-testid="transfer-dropdown-pay-me"
            @click="toast($t('toast.urlCopy'))">
            <NeoIcon icon="sack-dollar" class="mr-2" />{{
              $t('transfers.payMeLink')
            }}
          </NeoDropdownItem>

          <NeoDropdownItem
            v-clipboard:copy="recurringPaymentLink"
            class="whitespace-nowrap"
            data-testid="transfer-dropdown-recurring"
            @click="toast($t('toast.urlCopy'))">
            <NeoIcon icon="rotate" class="mr-2" />{{
              $t('transfers.recurringPaymentLink')
            }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>

      <PillTabs
        :tabs="tokenTabs"
        data-testid="transfer-token-tabs-container"
        @select="handleTokenSelect" />

      <div class="mb-5">
        <NeoIcon class="ml-2" icon="circle-info" />
        <span
          v-dompurify-html="
            $t('transfers.tooltip', [unit, chainNames[urlPrefix]])
          "></span>
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <span class="font-bold is-size-6 mb-1">{{
            $t('transfers.sender')
          }}</span>
          <div v-if="accountId" class="flex items-center">
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
        <div class="flex flex-col items-end">
          <span class="font-bold is-size-6 mb-1">{{
            $t('general.balance')
          }}</span>
          <div class="flex items-center">
            <img class="mr-2 is-32x32" :src="tokenIcon" alt="token" />
            <Money :value="balance.token" inline />
          </div>

          <span class="text-k-grey">≈ ${{ balance.usd }}</span>
        </div>
      </div>

      <hr />

      <div v-if="!isMobile" class="flex">
        <div class="font-bold is-size-6 mb-3 flex-1 mr-2 flex-grow-[2]">
          {{ $t('transfers.recipient') }}
        </div>
        <div class="font-bold is-size-6 mb-3 flex-1 flex-grow">
          {{ $t('amount') }}
        </div>
      </div>
      <div class="flex-grow flex-col">
        <div
          v-for="(destinationAddress, index) in targetAddresses"
          :key="index"
          class="mb-3">
          <div
            v-if="isMobile"
            class="font-bold is-size-6 mb-3 flex items-center justify-between">
            {{ $t('transfers.recipient') }} {{ index + 1 }}
            <a v-if="targetAddresses.length > 1" @click="deleteAddress(index)">
              <NeoIcon class="p-3" icon="trash" />
            </a>
          </div>
          <div
            :class="[
              'flex',
              {
                'flex-col': isMobile,
              },
            ]">
            <AddressInput
              v-model="destinationAddress.address"
              label=""
              class="flex-1 flex-grow-[2]"
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
            <div class="flex-1" :class="{ 'flex flex-grow': !isMobile }">
              <div v-if="displayUnit === 'token'" class="is-relative">
                <NeoInput
                  v-model="destinationAddress.token"
                  input-class="pr-8"
                  type="number"
                  placeholder="0"
                  step="0.01"
                  min="0"
                  icon-right-class="search"
                  data-testid="transfer-input-amount-token"
                  @focus="onAmountFieldFocus(destinationAddress, 'token')"
                  @update:modelValue="
                    onAmountFieldChange(destinationAddress)
                  " />
                <div class="is-absolute-right text-k-grey">
                  {{ unit }}
                </div>
              </div>

              <NeoInput
                v-else
                v-model="destinationAddress.usd"
                placeholder="0"
                type="number"
                step="0.01"
                min="0"
                icon-right="usd"
                icon-right-class="text-k-grey"
                data-testid="transfer-input-amount-usd"
                @focus="onAmountFieldFocus(destinationAddress, 'usd')"
                @update:modelValue="onUsdFieldChange(destinationAddress)" />
              <a
                v-if="!isMobile && targetAddresses.length > 1"
                class="flex"
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
        class="mb-5 flex justify-center cursor-pointer"
        data-testid="transfer-icon-add-recipient"
        @click="addAddress">
        {{ $t('transfers.addAddress') }}
        <NeoIcon class="ml-2" icon="plus" />
      </div>
      <div class="flex justify-between items-center mb-5">
        <div class="flex justify-between items-center">
          {{ $t('transfers.sendSameAmount') }}
          <!-- tips: don't use `margin` or `padding` directly on the tooltip trigger, it will cause misalignment of the tooltip -->
          <span class="mr-2" />
          <NeoTooltip :label="$t('transfers.setSameAmount')"
            ><NeoIcon icon="circle-info"
          /></NeoTooltip>
        </div>
        <NeoSwitch
          v-model="sendSameAmount"
          data-testid="transfer-switch-same" />
      </div>

      <div class="flex justify-between items-center mb-5">
        <span class="font-bold is-size-6">{{
          $t('transfers.displayUnit')
        }}</span>
        <div class="flex items-center">
          <span class="is-size-6 mr-1"
            >{{ $t('transfers.transferable') }}:
          </span>
          <span v-if="displayUnit === 'token'" class="font-bold is-size-6">
            <Money :value="transferableBalance.token" inline />
          </span>
          <span v-else class="font-bold is-size-6"
            >{{ transferableBalance.usd }} USD</span
          >
        </div>
      </div>

      <div class="flex field has-addons flex-grow justify-center mb-4">
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

      <div class="flex justify-between items-center mb-2">
        <span class="text-xs">{{ $t('transfers.networkFee') }}</span>
        <div class="flex items-center" data-testid="transfer-network-fee">
          <span class="text-xs text-k-grey mr-1"
            >({{ displayValues.fee[0] }})</span
          >
          <span class="text-xs">{{ displayValues.fee[1] }}</span>
        </div>
      </div>

      <div class="flex justify-between items-center mb-6">
        <span class="font-bold is-size-6">{{ $t('spotlight.total') }}</span>
        <div class="flex items-center">
          <span class="text-xs text-k-grey mr-1"
            >({{ displayValues.total.withFee[0] }})</span
          >

          <span
            class="font-bold is-size-6"
            data-testid="transfer-total-amount"
            >{{ displayValues.total.withFee[1] }}</span
          >
        </div>
      </div>

      <div class="flex">
        <NeoButton
          class="flex flex-1 fixed-height is-shadowless"
          variant="k-accent"
          :disabled="disabled"
          @click="handleOpenConfirmModal"
          >{{ $t('redirect.continue') }}</NeoButton
        >
      </div>
      <TransferConfirmModal
        :is-modal-active="isTransferModalVisible"
        :display-total-value="displayValues.total.withoutFee"
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
import zipWith from 'lodash/zipWith'
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
import { useIdentityStore } from '@/stores/identity'
import useExistentialDeposit from '@/composables/useExistentialDeposit'

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue'),
)

const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()
const { unit, decimals, withDecimals, withoutDecimals } = useChain()
const { apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const identityStore = useIdentityStore()
const { isLogIn, accountId } = useAuth()
const { getBalance } = useBalance()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const { initTransactionLoader, isLoading, resolveStatus, status } =
  useTransactionStatus()
const { toast } = useToast()
const { getTokenIconBySymbol } = useIcon()
const { tokens } = useToken()
const { chainExistentialDeposit } = useExistentialDeposit()

const DOT_BUFFER_FEE = 10000000 // 0.001
const KSM_BUFFER_FEE = 100000000 // 0.0001

type QueryTargetAddress = {
  target: string
  usdamount?: string
  amount?: string
}

export type TargetAddress = {
  address: string
  usd?: number | string
  token?: number | string
  isInvalid?: boolean
}

const isTransferModalVisible = ref(false)
const isLoaderModalVisible = ref(false)
const transactionValue = ref('')
const sendSameAmount = ref(false)
const displayUnit = ref<'token' | 'usd'>('token')
const selectedTabFirst = ref(true)
const tokenTabs = ref<PillTab[]>([])
const targetAddresses = ref<TargetAddress[]>([{ address: '' }])
const txFee = ref<number>(0)

// Computed refs

// balance related
const balance = computed(() => {
  const tokenAmount = Number(getBalance(unit.value)) || 0
  const usdAmount = calculateBalanceUsdValue(
    tokenAmount * Number(currentTokenValue.value),
    decimals.value,
    2,
  )

  return {
    token: tokenAmount,
    usd: usdAmount,
  }
})

const transferableBalance = computed(() => {
  const tokenDeduction = txFee.value + chainExistentialDeposit.value
  const tokenAmount = Math.max(balance.value.token - tokenDeduction, 0)
  const usdAmount = calculateBalanceUsdValue(
    tokenAmount * Number(currentTokenValue.value),
    decimals.value,
    2,
  )

  return {
    token: tokenAmount,
    usd: usdAmount,
  }
})

const totalValues: {
  withoutFee: {
    token: number
    usd: number
  }
  withFee: {
    token: number
    usd: number
  }
} = reactive({
  withoutFee: {
    token: computed(() => {
      const sumTokens = getNumberSumOfObjectField(
        targetAddresses.value,
        'token',
      )
      return withDecimals(sumTokens)
    }),
    usd: computed(() =>
      Number(
        calculateUsdFromToken(
          withoutDecimals({ value: totalValues.withoutFee.token }),
          Number(currentTokenValue.value),
        ).toFixed(4),
      ),
    ),
  },
  withFee: {
    token: computed(() => totalValues.withoutFee.token + txFee.value),
    usd: computed(() =>
      Number(
        calculateUsdFromToken(
          withoutDecimals({ value: totalValues.withFee.token }),
          Number(currentTokenValue.value),
        ).toFixed(4),
      ),
    ),
  },
})
const txFeeBuffer = computed(() => {
  switch (urlPrefix.value) {
    case 'ksm':
      return KSM_BUFFER_FEE
    case 'dot':
      return DOT_BUFFER_FEE
    default:
      return 0
  }
})

// ui related
const isMobile = computed(() => useWindowSize().width.value <= 764)
const tokenIcon = computed(() => getTokenIconBySymbol(unit.value))
const disabled = computed(() => {
  const tryingToSendTooMuch =
    totalValues.withoutFee.token > transferableBalance.value.token
  return !isLogIn.value || tryingToSendTooMuch || !hasValidTarget.value
})

const displayValues = computed(() => ({
  fee: getDisplayUnitBasedValues(
    calculateExactUsdFromToken(
      withoutDecimals({ value: txFee.value }),
      Number(currentTokenValue.value),
    ),
    withoutDecimals({ value: txFee.value }),
  ),
  total: {
    withoutFee: getDisplayUnitBasedValues(
      totalValues.withoutFee.usd,
      withoutDecimals({ value: totalValues.withoutFee.token }),
    ),
    withFee: getDisplayUnitBasedValues(
      totalValues.withFee.usd,
      withoutDecimals({ value: totalValues.withFee.token }),
    ),
  },
}))

// others

const hasValidTarget = computed(() =>
  targetAddresses.value.some(
    (item) => isAddress(item.address) && !item.isInvalid && item.token,
  ),
)

const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))

const recurringPaymentLink = computed(() => {
  const addresses = targetAddresses.value.filter(
    (item) => isAddress(item.address) && !item.isInvalid && item.usd,
  )
  return generatePaymentLink(addresses)
})

// END computed refs

const getDisplayUnitBasedValues = (
  usdValue: number,
  tokenAmount: number,
): [string, string] => {
  return displayUnit.value === 'token'
    ? [`$${usdValue}`, `${tokenAmount} ${unit.value}`]
    : [`${tokenAmount} ${unit.value}`, `$${usdValue}`]
}

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

const getQueryMultipleKeys = (
  queryKey: string,
  filter: (value: [string, any]) => boolean,
) =>
  Object.entries(route.query)
    .filter(([key]) => key.startsWith(queryKey))
    .filter(filter)
    .map(([, value]) => value as string)

const getQueryTargetAddresses = () =>
  getQueryMultipleKeys('target', ([_, address]) => {
    if (isAddress(address as string)) {
      return true
    }
    showNotification(
      `Unable to use target address ${address}`,
      notificationTypes.warn,
    )
    return false
  })

const isNumber = (value) => !isNaN(Number(value))

const getQueryUsdAmounts = () =>
  getQueryMultipleKeys('usdamount', ([_, usdamount]) => isNumber(usdamount))

const getQueryAmounts = () =>
  getQueryMultipleKeys('amount', ([_, amount]) => isNumber(amount))

const getQueryTargetAddress = ({
  target,
  usdamount,
  amount,
}: QueryTargetAddress): TargetAddress => {
  let tokenAmount = Number(amount)
  let usdValue = Number(usdamount)

  if (amount) {
    usdValue = calculateUsdFromToken(
      tokenAmount,
      Number(currentTokenValue.value),
    )
  } else if (usdamount) {
    tokenAmount = calculateTokenFromUsd(
      Number(getCurrentTokenValue(unit.value)),
      usdValue,
    )
  }

  return {
    address: target,
    usd: usdValue,
    token: tokenAmount,
  }
}

const checkQueryParams = () => {
  const targets = getQueryTargetAddresses()
  const usdAmounts = getQueryUsdAmounts()
  const amounts = getQueryAmounts()

  const queryTargetAddresses = zipWith(
    targets,
    usdAmounts,
    amounts,
    (target, usdamount, amount) =>
      ({
        target,
        usdamount,
        amount,
      }) as QueryTargetAddress,
  )

  if (targets.length) {
    targetAddresses.value = queryTargetAddresses.map(getQueryTargetAddress)
    sendSameAmount.value = getInitialSendSameAmount(
      queryTargetAddresses,
      usdAmounts.length !== 0 ? 'usdamount' : 'amount',
    )
  }
}

const getInitialSendSameAmount = (
  queryTargetAddresses: QueryTargetAddress[],
  keyToCheck: string,
): boolean => {
  const items = queryTargetAddresses.map((x) => x[keyToCheck])
  return new Set(items).size === 1 && items.length !== 1
}

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
  txFee.value = Number(fee) + txFeeBuffer.value
}

const updateAuthBalance = () => {
  accountId.value && identityStore.fetchBalance({ address: accountId.value })
}

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

const generatePaymentLink = (addressList: TargetAddress[]): string => {
  const url = new URL(`${location.origin}${location.pathname}`)

  addressList.forEach((addr, i) => {
    const suffix = i === 0 ? '' : i
    url.searchParams.append(`target${suffix}`, addr.address)

    if (displayUnit.value === 'usd') {
      url.searchParams.append(`usdamount${suffix}`, String(addr.usd))
    } else {
      url.searchParams.append(`amount${suffix}`, String(addr.token))
    }
  })

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

// watchers

watch(isLoading, (newValue, oldValue) => {
  // trigger modal only when loading change from false => true
  // we want to keep modal open when loading changes true => false
  if (newValue && !oldValue) {
    isLoaderModalVisible.value = isLoading.value
  }
})

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

watch(
  unit,
  () => {
    updateTargetAdressesOnTokenSwitch()
  },
  { immediate: true },
)

watch(urlPrefix, updateAuthBalance)

onMounted(() => {
  calculateTransactionFee()
  updateAuthBalance()
  fetchFiatPrice().then(checkQueryParams)
})

watchDebounced(
  [urlPrefix, () => targetAddresses.value.length],
  () => {
    calculateTransactionFee()
  },
  { debounce: 500 },
)

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
  @apply border-b-0;
}

.is-absolute-right {
  position: absolute;
  right: 0.5rem;
  top: 0.75rem;
}
</style>

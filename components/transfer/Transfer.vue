<template>
  <div class="transfer-card theme-background-color k-shadow border py-8 px-6">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center mb-2">
      <p class="has-text-weight-bold is-size-3">
        {{ $t('transfer') }} {{ unit }}
      </p>
      <NeoDropdown position="bottom-left" :mobile-modal="false">
        <template #trigger="{ active }">
          <NeoButton
            icon="ellipsis-vertical"
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
          <Money :value="balance" inline />
        </div>

        <span class="has-text-grey">≈ ${{ balanceUsdValue }}</span>
      </div>
    </div>

    <hr />

    <div class="is-flex">
      <div class="is-flex-grow-1 mr-2 is-flex is-flex-direction-column">
        <div class="has-text-weight-bold is-size-6 mb-3">
          {{ $t('transfers.recipient') }}
        </div>
        <div
          v-for="(destinationAddress, index) in targetAddresses"
          :key="index"
          class="mb-3">
          <AddressInput
            v-model="destinationAddress.address"
            label=""
            placeholder="Enter wallet address"
            :strict="false" />
        </div>
      </div>

      <div class="is-flex is-flex-direction-column">
        <div class="has-text-weight-bold is-size-6 mb-3">
          {{ $t('amount') }}
        </div>
        <div
          v-for="(destinationAddress, index) in targetAddresses"
          :key="index"
          class="mb-3">
          <NeoInput
            v-if="displayUnit === 'token'"
            v-model="destinationAddress.token"
            type="number"
            placeholder="0"
            step="0.01"
            min="0"
            icon-right-class="search"
            @input="onAmountFieldChange(destinationAddress)" />
          <NeoInput
            v-else
            v-model="destinationAddress.usd"
            placeholder="0"
            type="number"
            step="0.01"
            min="0"
            icon-right-class="search"
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
        <span class="is-size-6 mr-1">{{ $t('transfers.transferable') }}: </span>
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
        full-width
        no-shadow
        @click.native="displayUnit = 'token'" />
      <TabItem
        :active="displayUnit === 'usd'"
        text="USD"
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
        <span class="is-size-7 has-text-grey mr-1">(${{ totalUsdValue }})</span>

        <span class="has-text-weight-bold is-size-6"
          >{{ totalTokenAmount }} {{ unit }}</span
        >
      </div>
    </div>

    <div class="is-flex">
      <NeoButton
        class="is-flex is-flex-1 fixed-height"
        variant="k-accent"
        :disabled="disabled"
        @click.native="submit"
        >{{ $t('redirect.continue') }}</NeoButton
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import Connector from '@kodadot1/sub-api'
import { ALTERNATIVE_ENDPOINT_MAP, chainList } from '@kodadot1/static'

import { isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'

import { calculateKsmFromUsd, calculateUsdFromKsm } from '@/utils/calculation'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  calculateBalance,
  calculateBalanceUsdValue,
} from '@/utils/format/balance'
import { getNumberSumOfObjectField } from '@/utils/math'
import { useFiatStore } from '@/stores/fiat'
import { useIdentityStore } from '@/stores/identity'
import Avatar from '@/components/shared/Avatar.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import { getMovedItemToFront } from '@/utils/objects'

import { emptyObject } from '@kodadot1/minimark/utils'
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

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const route = useRoute()
const router = useRouter()
const { $consola, $i18n } = useNuxtApp()
const { unit, decimals } = useChain()
const { apiInstance } = useApi()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()
const { redesign } = useExperiments()
const { getAuthBalance } = useIdentityStore()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const { initTransactionLoader, isLoading, resolveStatus } =
  useTransactionStatus()
const { toast } = useToast()

type Target = 'target' | `target${number}`
type TargetMap = Record<Target, string>
type TargetAddress = {
  address?: string
  usd?: number | string
  token?: number | string
}

const transactionValue = ref('')
const price = ref(0)
const usdValue = ref(0)
const targets = ref(emptyObject<TargetMap>())
const sendSameAmount = ref(false)
const displayUnit = ref<'token' | 'usd'>('token')
const { getTokenIconBySymbol } = useIcon()
const { tokens, getPrefixByToken } = useToken()

const selectedTabFirst = ref(true)
const tokenIcon = computed(() => getTokenIconBySymbol(unit.value))

const tokenTabs = ref<TransferTokenTab[]>([])

const targetAddresses = ref<TargetAddress[]>([{}])

const hasValidTarget = computed(() =>
  targetAddresses.value.some((item) => isAddress(item.address) && item.token)
)

const balance = getAuthBalance
const disabled = computed(
  () =>
    !isLogIn.value ||
    balanceUsdValue.value < totalUsdValue.value ||
    !hasValidTarget.value
)

const handleTokenSelect = (newToken: string) => {
  selectedTabFirst.value = false
  const token = tokens.value.find((t) => t.symbol === newToken)

  if (token) {
    const chain = getPrefixByToken(token.symbol)

    if (!chain) {
      $consola.error(
        `[ERR: INVALID TOKEN] Chain for token ${token.symbol} is not valid`
      )
      return
    }

    setUrlPrefix(chain)
  }
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
    const tokenAmount = calculateKsmFromUsd(
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
  Number(getNumberSumOfObjectField(targetAddresses.value, 'token')).toFixed(4)
)
const totalUsdValue = computed(() =>
  getNumberSumOfObjectField(targetAddresses.value, 'usd')
)

const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))
const balanceUsdValue = computed(() =>
  calculateBalanceUsdValue(
    Number(balance) * Number(currentTokenValue.value),
    decimals.value
  )
)
const onAmountFieldChange = (target: TargetAddress) => {
  /* calculating usd value on the basis of price entered */

  target.usd = target.token
    ? calculateUsdFromKsm(
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
    ? calculateKsmFromUsd(
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

const submit = async (
  event: any,
  usedNodeUrls: string[] = []
): Promise<void> => {
  if (redesign.value) {
    showNotification('coming soon')
    return
  }

  showNotification(`${route.query.target ? 'Sent for Sign' : 'Dispatched'}`)
  initTransactionLoader()

  try {
    const api = await apiInstance.value
    const amountToTansfer = String(
      calculateBalance(price.value, decimals.value)
    )
    const numOfTargetAddresses = Object.keys(targets.value).length
    const cb =
      numOfTargetAddresses > 1 ? api.tx.utility.batch : api.tx.balances.transfer
    const arg =
      numOfTargetAddresses > 1
        ? [
            Object.values(targets.value).map((target) =>
              api.tx.balances.transfer(target, amountToTansfer)
            ),
          ]
        : [targets.value['target'], amountToTansfer]

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
            `[${unit.value}] Transfered ${price.value * numOfTargetAddresses} ${
              unit.value
            } in block ${blockNumber}`,
            notificationTypes.success
          )

          targetAddresses.value = [{}]
          price.value = 0
          usdValue.value = 0
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

const generatePaymentLink = (address?): string => {
  let addressQueryString: string
  if (address) {
    addressQueryString = `target=${address}`
  } else {
    addressQueryString = new URLSearchParams(targets.value).toString()
  }
  return `${window.location.origin}/${urlPrefix.value}/transfer?${addressQueryString}&usdamount=${usdValue.value}&donation=true`
}

const addAddress = () => {
  targetAddresses.value.push({
    ...(sendSameAmount.value ? targetAddresses.value[0] : {}),
    address: '',
  })
}
onMounted(() => {
  fetchFiatPrice().then(checkQueryParams)
})

watch(
  () => targetAddresses.value[0].usd,
  (usdamount) => {
    router
      .replace({
        query: { ...route.query, usdamount: (usdamount || 0).toString() },
      })
      .catch(() => null) // null to further not throw navigation errors
  }
)
</script>
<style lang="scss" scoped>
.transfer-card {
  max-width: 41rem;

  .square-32 {
    width: 32px;
    height: 32px;
  }

  .fixed-height {
    height: 51px;
  }
}
</style>
~~/utils/objects

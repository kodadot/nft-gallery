<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <nuxt-link
      v-if="$route.query.target"
      :to="`/${urlPrefix}/u/${correctAddress}`"
      class="pl-4 is-flex is-align-items-center">
      <NeoIcon icon="chevron-left" class="mr-2" />
      {{ $t('teleport.artistProfile') }}
    </nuxt-link>
    <p class="title is-size-3">
      {{ $t('transfer') }} {{ unit }}
      <span class="has-text-primary">${{ getCurrentTokenValue(unit) }}</span>
    </p>

    <NeoField>
      <Auth />
    </NeoField>

    <div v-if="targets && hasBlockExplorer" class="mb-3">
      {{ $t('teleport.donationSentTo') }}
      <a
        v-for="target in targets"
        :key="target"
        v-safe-href="addressExplorerUrl(target)"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="has-text-weight-bold">
        <Identity ref="identity" :address="target" show-onchain-identity />
      </a>
    </div>

    <div class="is-flex is-align-items-center">
      <NeoField>
        {{ $t('general.balance') }}
        <Money :value="balance" inline />
      </NeoField>
    </div>

    <div
      v-for="(destinationAddress, index) in destinationAddresses"
      :key="destinationAddress">
      <div class="is-flex">
        <NeoField class="is-flex-grow-1">
          <AddressInput v-model="destinationAddresses[index]" :strict="false" />
        </NeoField>
        <NeoButton
          v-show="index == destinationAddresses.length - 1"
          variant="primary"
          size="small"
          icon-left="plus"
          class="ml-2 mt-2"
          no-shadow
          @click.native="addAddress">
          Add
        </NeoButton>
      </div>

      <DisabledInput
        v-show="
          correctAddress(destinationAddress) &&
          correctAddress(destinationAddress) !== destinationAddress
        "
        :label="$t('general.correctAddress')"
        :value="correctAddress(destinationAddress)" />
    </div>
    <div class="container mb-3">
      <NeoField>
        <BalanceInput
          v-model="price"
          :label="$t('amount')"
          :calculate="false"
          @input="onAmountFieldChange" />
      </NeoField>
      <NeoField>
        <ReadOnlyBalanceInput
          v-model="usdValue"
          :label-input="$t('teleport.usdInput')"
          label="USD"
          @input="onUSDFieldChange" />
      </NeoField>
    </div>

    <NeoField grouped group-multiline>
      <NeoButton
        variant="primary"
        icon-left="paper-plane"
        :loading="isLoading"
        :disabled="disabled"
        no-shadow
        class="m-1"
        @click.native="submit">
        {{ $t('general.submit') }}
      </NeoButton>
      <NeoButton
        v-if="transactionValue && hasBlockExplorer"
        variant="success"
        icon-left="external-link-alt"
        no-shadow
        class="m-1"
        @click.native="getExplorerUrl">
        {{ $t('View Transaction') }} {{ transactionValue.substring(0, 6)
        }}{{ '...' }}
      </NeoButton>
      <NeoButton
        v-if="transactionValue && hasBlockExplorer"
        v-clipboard:copy="getUrl()"
        variant="primary"
        no-shadow
        class="m-1"
        @click.native="toast($t('toast.urlCopy'))">
        <NeoIcon pack="fas" icon="link" />
      </NeoButton>
      <NeoButton
        v-if="hasAddress"
        v-clipboard:copy="generatePaymentLink()"
        variant="success"
        icon-left="money-bill"
        :loading="isLoading"
        no-shadow
        class="m-1"
        @click.native="toast($t('toast.paymentLinkCopy'))">
        {{ $t('Copy Payment link') }}
      </NeoButton>
      <NeoButton
        v-if="accountId"
        v-clipboard:copy="generatePaymentLink(accountId)"
        variant="info"
        icon-left="wallet"
        :loading="isLoading"
        no-shadow
        class="m-1"
        @click.native="toast($t('general.copyRewardTooltip'))">
        {{ $t('general.copyRewardLink') }}
      </NeoButton>
    </NeoField>

    <div v-if="transactionValue && $route.query.donation">
      <div class="is-size-5">
        🎉 {{ $t('teleport.congratsSupport') }}
        <Identity ref="identity" :address="$route.query.target" />
      </div>
      <NeoButton
        variant="info"
        class="mt-2"
        icon-left="share-square"
        no-shadow
        @click.native="shareInTweet">
        {{ $t('teleport.tweetDonation') }}
      </NeoButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import Connector from '@kodadot1/sub-api'
import { ALTERNATIVE_ENDPOINT_MAP } from '@kodadot1/static'

import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'

import {
  calculateTokenFromUsd,
  calculateUsdFromToken,
} from '@/utils/calculation'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import { calculateBalance } from '@/utils/format/balance'
import correctFormat from '@/utils/ss58Format'
import { urlBuilderTransaction } from '@/utils/explorerGuide'

import { useFiatStore } from '@/stores/fiat'
import { useIdentityStore } from '@/stores/identity'

import { getExplorer, hasExplorer } from '@kodadot1/static'
import { emptyObject } from '@kodadot1/minimark/utils'
import { NeoButton, NeoField, NeoIcon } from '@kodadot1/brick'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()
const { chainProperties, unit, decimals, blockExplorer } = useChain()
const { apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()
const { getAuthBalance } = useIdentityStore()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const { initTransactionLoader, isLoading, resolveStatus, status } =
  useTransactionStatus()
const { toast } = useToast()

type Target = 'target' | `target${number}`
type TargetMap = Record<Target, string>

const destinationAddresses = ref([''])
const transactionValue = ref('')
const price = ref(0)
const usdValue = ref(0)
const targets = ref(emptyObject<TargetMap>())

const ss58Format = computed(() => chainProperties.value?.ss58Format)
const hasAddress = computed(() => Object.keys(targets.value).length > 0)
const disabled = computed(
  () => !hasAddress.value || !price.value || !isLogIn.value
)
const hasBlockExplorer = computed(() => hasExplorer(urlPrefix.value))
const balance = getAuthBalance

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
    destinationAddresses.value = targets
  }

  if (query.amount) {
    price.value = Number(query.amount)
  }

  if (query.usdamount) {
    usdValue.value = Number(query.usdamount)

    price.value = calculateTokenFromUsd(
      Number(getCurrentTokenValue(unit.value)),
      usdValue.value
    )
  }
}

const onAmountFieldChange = () => {
  /* calculating usd value on the basis of price entered */
  if (price.value) {
    usdValue.value = calculateUsdFromToken(
      Number(getCurrentTokenValue(unit.value)),
      price.value
    )
  } else {
    usdValue.value = 0
  }
}

const onUSDFieldChange = () => {
  /* calculating price value on the basis of usd entered */
  if (usdValue.value) {
    price.value = calculateTokenFromUsd(
      Number(getCurrentTokenValue(unit.value)),
      usdValue.value
    )
  } else {
    price.value = 0
  }
}

const submit = async (
  event: any,
  usedNodeUrls: string[] = []
): Promise<void> => {
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

          destinationAddresses.value = ['']
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

const getUrl = (): string =>
  urlBuilderTransaction(transactionValue.value, blockExplorer.value)

const getExplorerUrl = (): void => {
  const url = getUrl()
  window.open(url, '_blank')
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

const shareInTweet = () => {
  const text =
    'I have just helped a really cool creator by donating. Check my donation proof:'
  const url = `https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${getUrl()}`
  window.open(url, '_blank')
}

const addAddress = () => {
  destinationAddresses.value.push('')
}
const correctAddress = (destinationAddress): string =>
  isAddress(destinationAddress)
    ? encodeAddress(destinationAddress, correctFormat(ss58Format.value))
    : ''
const addressExplorerUrl = (address): string =>
  getExplorer(urlPrefix.value, address) || '#'

onMounted(() => {
  fetchFiatPrice().then(checkQueryParams)
})

watch(
  destinationAddresses,
  () => {
    const { usdamount } = route.query

    targets.value = destinationAddresses.value
      .filter((addr) => isAddress(addr))
      .reduce(
        (object, address, i) => ({
          ...object,
          [`target${i == 0 ? '' : i}`]: address,
        }),
        {} as TargetMap
      )
    router.replace({ query: { ...targets.value, usdamount } }).catch(() => null) // null to further not throw navigation errors
  },
  { deep: true }
)

watch(usdValue, (usdamount) => {
  router
    .replace({ query: { ...route.query, usdamount: usdamount.toString() } })
    .catch(() => null) // null to further not throw navigation errors
})
</script>

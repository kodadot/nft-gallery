<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <nuxt-link
      v-if="$route.query.target"
      :to="`/${urlPrefix}/u/${destinationAddress}`"
      class="pl-4 is-flex is-align-items-center">
      <NeoIcon icon="chevron-left" class="mr-2" />
      {{ $t('teleport.artistProfile') }}
    </nuxt-link>
    <p class="title is-size-3">
      {{ $t('teleport.page') }} {{ unit }}
      <span v-if="isKSM" class="has-text-primary"
        >${{ getCurrentKSMValue }}</span
      >
    </p>

    <NeoField>
      <Auth />
    </NeoField>

    <AccountBalance />

    <p class="subtitle is-size-6">
      {{ routeMessage }}
    </p>

    <BasicSwitch v-model="sendingMyself" label="action.sendToMyself" />

    <NeoField v-show="!sendingMyself">
      <AddressInput v-model="destinationAddress" :strict="false" />
    </NeoField>
    <DisabledInput
      v-show="correctAddress && correctAddress !== destinationAddress"
      :label="$t('general.correctAddress')"
      :value="correctAddress" />
    <div class="box--container mb-3">
      <NeoField>
        <BalanceInput
          v-model="price"
          :label="$t('amount')"
          :calculate="false"
          @input="onAmountFieldChange" />
      </NeoField>
      <NeoField v-if="isKSM">
        <ReadOnlyBalanceInput
          v-model="usdValue"
          :label-input="$t('teleport.usdInput')"
          label="USD"
          @input="onUSDFieldChange" />
      </NeoField>
    </div>

    <div class="buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        :loading="isLoading"
        :disabled="disabled"
        outlined
        @click="submit">
        {{ $t('general.submit') }}
      </b-button>
      <b-button
        v-if="transactionValue"
        type="is-success"
        class="ml-4"
        icon-left="external-link-alt"
        outlined
        @click="getExplorerUrl">
        {{ $t('View Transaction') }} {{ transactionValue.substring(0, 6)
        }}{{ '...' }}
      </b-button>
      <b-button
        v-if="transactionValue"
        v-clipboard:copy="getUrl()"
        type="is-primary"
        @click="toast($t('toast.urlCopy'))">
        <NeoIcon pack="fas" icon="link" />
      </b-button>
      <b-button
        v-if="destinationAddress"
        v-clipboard:copy="generatePaymentLink()"
        type="is-success"
        icon-left="money-bill"
        :loading="isLoading"
        outlined
        @click="toast($t('toast.paymentLinkCopy'))">
        {{ $t('teleport.btnCopyPayment') }}
      </b-button>
    </div>
    <div v-if="transactionValue && $route.query.donation">
      <div class="is-size-5">
        🎉 {{ $t('teleport.congratsSupport') }}
        <Identity ref="identity" :address="$route.query.target" />
      </div>
      <b-button
        type="is-info"
        class="mt-2"
        icon-left="share-square"
        outlined
        @click="shareInTweet">
        {{ $t('teleport.tweetDonation') }}
      </b-button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { DispatchError } from '@polkadot/types/interfaces'
import { onApiConnect } from '@kodadot1/sub-api'

import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'

import { calculateKsmFromUsd, calculateUsdFromKsm } from '@/utils/calculation'
import { findCall, getApiParams } from '@/utils/teleport'
import { calculateBalance } from '@/utils/format/balance'
import correctFormat from '@/utils/ss58Format'
import { urlBuilderTransaction } from '@/utils/explorerGuide'

import { useFiatStore } from '@/stores/fiat'
import { NeoField, NeoIcon } from '@kodadot1/brick'
import BasicSwitch from './shared/form/BasicSwitch.vue'

const { accountId, isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { chainProperties, unit, decimals, blockExplorer } = useChain()
const { apiUrl, apiInstance } = useApi()
const route = useRoute()
const router = useRouter()
const { initTransactionLoader, isLoading, resolveStatus, status } =
  useTransactionStatus()
const { $i18n, $consola } = useNuxtApp()

const { toast } = useToast()
const { fetchFiatPrice, getCurrentKSMValue } = useFiatStore()

const price = ref(0)
const usdValue = ref(0)
const destinationAddress = ref('')
const sendingMyself = ref(true)
const paraTeleport = ref<string | null>(null)
const transactionValue = ref('')

const hasAddress = computed(() => isAddress(destinationAddress.value))
const ss58Format = computed(() => chainProperties.value.ss58Format)
const correctAddress = computed(() =>
  hasAddress.value
    ? encodeAddress(destinationAddress.value, correctFormat(ss58Format.value))
    : ''
)
const isKSM = computed(() => unit.value === 'KSM')

const disabled = computed(
  () => !(isLogIn && price.value && (sendingMyself.value || hasAddress.value))
)

const getUrl = () =>
  urlBuilderTransaction(transactionValue.value, blockExplorer.value)

const getExplorerUrl = () => {
  window.open(getUrl(), '_blank')
}

const generatePaymentLink = () =>
  `${window.location.origin}/${urlPrefix.value}/transfer?target=${destinationAddress.value}&usdamount=${usdValue.value}&donation=true`

const shareInTweet = () => {
  const text =
    'I have just helped a really cool creator by donating. Check my donation proof:'
  const url = `https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${generatePaymentLink()}`
  window.open(url, '_blank')
}
const currentRoute = computed(() => {
  if (paraTeleport.value === '') {
    return ['relaychain', 'parachain']
  }

  if (paraTeleport.value === null) {
    return ['unknown', 'unknown']
  }

  return [`parachain ${paraTeleport.value}`, 'relaychain']
})
const routeMessage = computed(() => {
  const [from, to] = currentRoute.value
  return $i18n.t('teleport.route', [unit.value, from, to])
})

const checkQueryParams = () => {
  if (route.query.target) {
    const hasAddress = isAddress(route.query.target as string)
    if (hasAddress) {
      destinationAddress.value = route.query.target as string
    } else {
      showNotification('Unable to use target address', notificationTypes.warn)
    }
  }

  if (route.query.amount) {
    price.value = Number(route.query.amount)
  }

  if (route.query.usdamount) {
    usdValue.value = Number(route.query.usdamount)
    // getting ksm value from the usd value
    price.value = calculateKsmFromUsd(
      getCurrentKSMValue as number,
      usdValue.value
    )
  }
}

const onAmountFieldChange = () => {
  /* calculating usd value on the basis of price entered */
  if (price.value) {
    usdValue.value = calculateUsdFromKsm(
      getCurrentKSMValue as number,
      price.value
    )
  } else {
    usdValue.value = 0
  }
}

const onUSDFieldChange = () => {
  /* calculating price value on the basis of usd entered */
  if (usdValue.value) {
    price.value = calculateKsmFromUsd(
      getCurrentKSMValue as number,
      usdValue.value
    )
  } else {
    price.value = 0
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

const submit = async (): Promise<void> => {
  showNotification(`${route.query.target ? 'Sent for Sign' : 'Dispatched'}`)
  initTransactionLoader()

  try {
    const api = await apiInstance.value
    const isParaTeleport = await api.query.parachainInfo?.parachainId()

    const cb = findCall(api)
    const arg = getApiParams(
      api,
      cb,
      isParaTeleport?.toString(),
      sendingMyself.value ? accountId.value : destinationAddress.value,
      calculateBalance(price.value, decimals.value).toString()
    )

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
            `[${unit.value}] Transfered ${price.value} ${unit.value} in block ${blockNumber}`,
            notificationTypes.success
          )

          destinationAddress.value = ''
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
  } catch (e) {
    $consola.error('[ERR: TRANSFER SUBMIT]', e)
    if (e instanceof Error) {
      showNotification(e.message, notificationTypes.warn)
    }
  }
}

onMounted(() => {
  fetchFiatPrice()
  checkQueryParams()
  onApiConnect(apiUrl.value, async (api) => {
    const paraId = await api.query.parachainInfo?.parachainId()
    paraTeleport.value = paraId?.toString() || ''
  })
})

watch(destinationAddress, (value) => {
  if (value) {
    const queryValue: any = {}
    if (value) {
      queryValue.target = value
    }
    if (route.query.usdamount) {
      queryValue.usdamount = route.query.usdamount
    }
    router.replace({
      name: String(route.name),
      query: queryValue,
    })
  }
})

watch(usdValue, (value) => {
  const queryValue: any = {}
  if (value) {
    queryValue.usdamount = value
  }
  if (route.query.target) {
    queryValue.target = route.query.target
  }
  router.replace({
    name: String(route.name),
    query: queryValue,
  })
})
</script>

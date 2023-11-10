<template>
  <div>
    <div class="mt-5">
      <p class="has-text-weight-bold">{{ $t('migrate.collection') }}</p>
      <div class="is-flex mt-4">
        <img
          class="border mr-4"
          :src="sanitizeIpfsUrl(collection?.meta?.image)"
          alt="My crazy adventure"
          width="48"
          height="48" />
        <div>
          <p>{{ collection?.name }}</p>
          <p class="has-text-grey is-size-7">
            {{ $t('migrate.collectionName') }}
          </p>
        </div>
      </div>
    </div>

    <hr />

    <div class="is-flex is-justify-content-space-between mb-5">
      <p>{{ $t('migrate.ready.status') }}</p>
      <p>{{ collection?.nftsOwned?.length }}/{{ collection?.nfts?.length }}</p>
    </div>

    <div class="shade-border-color p-2 is-flex is-size-7 has-text-grey">
      <NeoIcon icon="circle-info" class="mr-2" />
      <p>{{ $t('migrate.reviewNotes') }}</p>
    </div>

    <div>
      <p class="has-text-weight-bold mt-5">{{ $t('migrate.route') }}:</p>
      <NeoButton rounded variant="pill" class="mt-2 no-hover">
        <div class="is-flex is-align-items-center">
          <img
            width="20"
            :src="source?.icon"
            :alt="source?.text"
            class="mr-2" />
          {{ source?.text }}
        </div>
        <NeoIcon icon="chevron-right" class="mx-4" />
        <div class="is-flex is-align-items-center">
          <img
            width="20"
            :src="destination?.icon"
            :alt="destination?.text"
            class="mr-2" />
          {{ destination?.text }}
        </div>
      </NeoButton>
    </div>

    <hr />

    <div>
      <div class="has-text-weight-bold mt-5">{{ $t('migrate.costs') }}</div>

      <div class="is-size-7">
        <p
          class="my-4 has-text-grey is-cursor-pointer"
          @click="toggleFee = !toggleFee">
          {{ $t('migrate.feeBreakdown') }}
          <NeoIcon :icon="toggleFee ? 'chevron-up' : 'chevron-down'" />
        </p>

        <div v-show="toggleFee">
          <!-- paid on source chain -->
          <p v-if="source?.value" class="mb-2">
            <strong>Paid On {{ prefixToNetwork[source.value] }}</strong>
          </p>
          <div class="is-flex is-justify-content-space-between mb-5">
            <p>Burn {{ itemCount }} Items</p>
            <p>{{ sourceNetworkFee }} {{ sourceSymbol }}</p>
          </div>

          <!-- paid on destination chain -->
          <p v-if="destination?.value" class="mb-2">
            <strong>Paid On {{ prefixToNetwork[destination.value] }}</strong>
          </p>
          <div class="is-flex is-justify-content-space-between mt-1">
            <p>Migrate {{ itemCount }} Items</p>
            <p>{{ destinationNetworkFee }} {{ destinationSymbol }}</p>
          </div>
          <div
            class="has-text-grey is-flex mt-1 is-align-items-center is-justify-content-space-between">
            <div>
              {{ $t('mint.collection.modal.existentialDeposit') }}
              <NeoTooltip
                position="top"
                class="is-cursor-pointer"
                multiline-width="14rem"
                multiline
                :label="
                  $t('mint.collection.modal.depositTooltip', [
                    totalCollectionDeposit,
                    destinationSymbol,
                  ])
                ">
                <NeoIcon icon="circle-question" />
              </NeoTooltip>
            </div>
            <p>{{ totalCollectionDeposit }} {{ destinationSymbol }}</p>
          </div>
          <div
            class="has-text-grey is-flex mt-1 is-align-items-center is-justify-content-space-between">
            <div>
              {{ $t('mint.nft.modal.existentialDeposit') }}
              <NeoTooltip
                position="top"
                class="is-cursor-pointer"
                multiline-width="14rem"
                multiline
                :label="
                  $t('mint.nft.modal.depositTooltip', [
                    destinationItemDeposit,
                    destinationSymbol,
                  ])
                ">
                <NeoIcon icon="circle-question" />
              </NeoTooltip>
            </div>
            <p>{{ destinationItemDeposit }} {{ destinationSymbol }}</p>
          </div>

          <div
            class="is-flex mt-1 has-text-grey is-align-items-center is-justify-content-space-between">
            <div>
              {{ $t('mint.nft.modal.kodadotFee') }}
              <NeoTooltip
                class="is-cursor-pointer"
                position="top"
                multiline-width="14rem"
                :label="$t('mint.nft.modal.kodadotTooltip')"
                multiline>
                <NeoIcon icon="circle-question" />
              </NeoTooltip>
            </div>
            <div>{{ kodadotFee }} {{ destinationSymbol }}</div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="mb-1 is-flex is-justify-content-space-between">
      <div v-if="source?.value" class="has-text-k-grey">
        On {{ prefixToNetwork[source.value] }} - {{ sourceBalance }}
      </div>
      <div class="is-flex is-align-items-center">
        <div class="has-text-k-grey is-size-7 mr-2">${{ sourceTotalUsd }}</div>
        <div>{{ sourceNetworkFee }} {{ sourceSymbol }}</div>
      </div>
    </div>
    <div class="pb-7 is-flex is-justify-content-space-between">
      <div v-if="destination?.value" class="has-text-k-grey">
        On {{ prefixToNetwork[destination.value] }} - {{ destinationBalance }}
      </div>
      <div class="is-flex is-align-items-center">
        <div class="has-text-k-grey is-size-7 mr-2">
          ${{ totalDestinationUsd }}
        </div>
        <div>{{ totalDestination }} {{ destinationSymbol }}</div>
      </div>
    </div>

    <NeoField>
      <NeoCheckbox v-model="agree">{{ $t('migrate.agreement') }}</NeoCheckbox>
    </NeoField>

    <NeoButton
      :label="checkBalances.label"
      variant="k-accent"
      :disabled="checkBalances.disabled"
      class="mt-4 btn-submit"
      expanded
      @click="toSign()" />
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoCheckbox,
  NeoField,
  NeoIcon,
  NeoTooltip,
} from '@kodadot1/brick'
import { type Prefix } from '@kodadot1/static'
import { prefixToNetwork } from '@/composables/useMultipleBalance'
import { useCollectionReady } from '@/composables/useMigrate'
import { availablePrefixWithIcon } from '@/utils/chain'
import format from '@/utils/format/balance'

const { $i18n } = useNuxtApp()
const { accountId } = useAuth()
const fiatStore = useFiatStore()
const preferencesStore = usePreferencesStore()

const route = useRoute()
const source = availablePrefixWithIcon().find(
  (item) => item.value === route.query.source,
)
const destination = availablePrefixWithIcon().find(
  (item) => item.value === route.query.destination,
)
const itemCount = parseInt(route.query.itemCount?.toString() || '0')
const fromAccountId = route.query.accountId?.toString()

const collectionId = route.query.collectionId
const { collections } = await useCollectionReady()
const collection = computed(() =>
  collections.value.find((item) => item.id === collectionId),
)

const parseDeposit = (deposit, decimals) => {
  return parseFloat(format(deposit, decimals, false))
}

// source balance and deposit
const sourceChain = computed(() => (source?.value || 'ksm') as Prefix)
const {
  balance: sourceBalance,
  chainSymbol: sourceSymbol,
  chain: sourcePrefix,
} = useDeposit(sourceChain)
const sourceDecimals = computed(() => {
  if (sourcePrefix.value?.tokenDecimals) {
    return sourcePrefix.value.tokenDecimals
  }

  return 12
})
const sourceNetworkFee = computedAsync(async () => {
  if (fromAccountId) {
    const fee = await getTransitionFee(
      fromAccountId,
      [''],
      sourceDecimals.value,
    )
    return parseDeposit(parseInt(fee) * itemCount, sourceDecimals.value)
  }

  return 0
})
const sourceTokenPrice = computed(() =>
  Number(fiatStore.getCurrentTokenValue(sourceSymbol.value) ?? 0),
)
const sourceTotalUsd = computed(
  () => sourceNetworkFee.value * sourceTokenPrice.value,
)

// destination balance and deposit
const destinationChain = computed(() => (destination?.value || 'ksm') as Prefix)
const {
  balance: destinationBalance,
  itemDeposit,
  existentialDeposit,
  metadataDeposit,
  totalCollectionDeposit,
  chainSymbol: destinationSymbol,
  chain,
} = useDeposit(destinationChain)
const destinationDecimals = computed(() => {
  if (chain.value?.tokenDecimals) {
    return chain.value.tokenDecimals
  }

  return 12
})
const destinationItemDeposit = computed(() =>
  parseDeposit(
    (metadataDeposit.value + itemDeposit.value + existentialDeposit.value) *
      itemCount,
    destinationDecimals.value,
  ),
)
const destinationTokenPrice = computed(() =>
  Number(fiatStore.getCurrentTokenValue(destinationSymbol.value) ?? 0),
)
const kodadotFee = computed(() =>
  parseDeposit(
    ((preferencesStore.hasSupport ? BASE_FEE : 0) /
      destinationTokenPrice.value) *
      Math.pow(10, destinationDecimals.value),
    destinationDecimals.value,
  ),
)
const destinationNetworkFee = computedAsync(async () => {
  if (accountId.value) {
    const fee = await getTransitionFee(
      accountId.value,
      [''],
      destinationDecimals.value,
    )
    return parseDeposit(parseInt(fee) * itemCount, destinationDecimals.value)
  }

  return 0
})
const totalDestination = computed(() => {
  const total =
    destinationNetworkFee.value +
    parseFloat(totalCollectionDeposit.value) +
    destinationItemDeposit.value +
    kodadotFee.value

  if (isNaN(total)) {
    return 0
  }

  return parseFloat(total.toString()).toFixed(4)
})
const totalDestinationUsd = computed(
  () =>
    parseFloat(totalDestination.value.toString()) * destinationTokenPrice.value,
)

const agree = ref(false)
const toggleFee = ref(true)
const checkBalances = computed(() => {
  const insufficient = $i18n.t('tooltip.notEnoughBalance')
  const sourceNetwork = prefixToNetwork[sourceChain.value]
  const sourceBalances = parseFloat(sourceBalance.value)
  const destinationNetwork = prefixToNetwork[destinationChain.value]
  const destinationBalances = parseFloat(destinationBalance.value)
  const total = parseFloat(totalDestination.value.toString())

  if (!agree.value) {
    return {
      label: $i18n.t('migrate.reviewCtaUncheck'),
      disabled: true,
    }
  }

  if (sourceBalances < sourceNetworkFee.value) {
    return {
      label: `${insufficient} On ${sourceNetwork}`,
      disabled: true,
    }
  }

  if (destinationBalances < total) {
    return {
      label: `${insufficient} On ${destinationNetwork}`,
      disabled: true,
    }
  }

  if (sourceBalances > sourceNetworkFee.value && destinationBalances > total) {
    return {
      label: $i18n.t('migrate.reviewCtaCheck'),
      disabled: false,
    }
  }

  return {
    label: `${insufficient} On ${sourceNetwork} & ${destinationNetwork}`,
    disabled: true,
  }
})

const toSign = () => {
  navigateTo({
    path: '/migrate/sign',
    query: {
      ...route.query,
    },
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.shade-border-color {
  @include ktheme() {
    border: 1px solid theme('k-shade');
  }
}

.btn-submit {
  height: 3.5rem;
}
</style>

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
          <p v-if="source?.value" class="mb-2 is-capitalized">
            <strong>Paid On {{ prefixToNetwork[source.value] }}</strong>
          </p>
          <div class="is-flex is-justify-content-space-between mb-5">
            <p>Burn {{ itemCount }} Items</p>
            <p>{{ sourceNetworkFee }} {{ sourceSymbol }}</p>
          </div>

          <!-- paid on destination chain -->
          <p v-if="destination?.value" class="mb-2 is-capitalized">
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

    <p class="mb-1">{{ $t('mint.estimated') }}</p>
    <div class="mb-1 is-flex is-justify-content-space-between">
      <div v-if="source?.value" class="has-text-k-grey is-capitalized">
        On {{ prefixToNetwork[source.value] }}
      </div>
      <div class="is-flex is-align-items-center">
        <div class="has-text-k-grey is-size-7 mr-2">${{ sourceTotalUsd }}</div>
        <div>{{ sourceNetworkFee }} {{ sourceSymbol }}</div>
      </div>
    </div>
    <div class="pb-7 is-flex is-justify-content-space-between">
      <div v-if="destination?.value" class="has-text-k-grey is-capitalized">
        On {{ prefixToNetwork[destination.value] }}
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
      class="mt-4 btn-submit is-capitalized"
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
import { useCollectionReady, useMigrateDeposit } from '@/composables/useMigrate'
import { availablePrefixWithIcon } from '@/utils/chain'

const { $i18n } = useNuxtApp()
const { accountId } = useAuth()

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

// source balance and deposit
const sourceChain = computed(() => (source?.value || 'ksm') as Prefix)
const {
  balance: sourceBalance,
  chainNetworkFee: sourceNetworkFee,
  chainSymbol: sourceSymbol,
  totalChainUsd: sourceTotalUsd,
} = useMigrateDeposit(sourceChain, itemCount, fromAccountId)

// destination balance and deposit
const destinationChain = computed(() => (destination?.value || 'ksm') as Prefix)
const {
  balance: destinationBalance,
  chainItemDeposit: destinationItemDeposit,
  chainNetworkFee: destinationNetworkFee,
  chainSymbol: destinationSymbol,
  kodadotFee,
  totalChain: totalDestination,
  totalChainUsd: totalDestinationUsd,
  totalCollectionDeposit,
} = useMigrateDeposit(destinationChain, itemCount, accountId.value)

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

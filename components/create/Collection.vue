<template>
  <div class="columns is-centered">
    <Loader v-model="isLoading" :status="status" />
    <form class="column is-half" @submit.prevent="createCollection">
      <h2 class="title is-size-3">
        {{ $t('mint.collection.create') }}
      </h2>

      <!-- collection logo -->
      <NeoField :label="`${$t('mint.collection.logo.image')} *`">
        <div>
          <p>{{ $t('mint.collection.logo.message') }}</p>
          <DropUpload
            v-model="logo"
            required
            expanded
            preview
            :label="$t('mint.collection.drop')" />
        </div>
      </NeoField>

      <!-- collection name -->
      <NeoField
        :label="`${$t('mint.collection.name.label')} *`"
        required
        :error="!name">
        <NeoInput v-model="name" required />
      </NeoField>

      <!-- collection description -->
      <NeoField
        :label="`${$t('mint.collection.description.label')} (optional)`">
        <NeoInput
          v-model="description"
          type="textarea"
          has-counter
          maxlength="1000"
          height="10rem" />
      </NeoField>

      <!-- collection max nfts -->
      <NeoField
        v-if="!isBasilisk"
        :label="$t('Maximum NFTs in collection')"
        required>
        <div class="w-full">
          <div class="is-flex is-justify-content-space-between">
            <p>{{ $t('mint.unlimited') }}</p>
            <NeoSwitch v-model="unlimited" />
          </div>
          <NeoInput
            v-if="!unlimited"
            v-model="max"
            class="mt-3"
            type="number"
            placeholder="1 is the minimum"
            :min="1" />
        </div>
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div>
          <p>{{ $t('mint.blockchain.message') }}</p>
          <NeoSelect v-model="selectBlockchain" class="mt-3" expanded>
            <option v-for="menu in menus" :key="menu.value" :value="menu.value">
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <!-- collection symbol -->
      <NeoField
        v-if="isKusama"
        :label="`${$t('mint.collection.symbol.label')} *`">
        <div>
          <p>{{ $t('mint.collection.symbol.message') }}</p>
          <NeoInput
            ref="symbolInput"
            v-model="symbol"
            :placeholder="$t('mint.collection.symbol.placeholder')"
            maxlength="10"
            required
            expanded />
        </div>
      </NeoField>

      <!-- deposit -->
      <div v-if="isBasilisk || isAssetHub">
        <hr class="my-6" />
        <NeoField>
          <div class="monospace">
            <p class="has-text-weight-medium is-size-6 has-text-info">
              <span>{{ $t('mint.deposit') }}:</span>
              <span>{{ collectionDeposit }} {{ depositAssetSymbol }}</span>
            </p>
            <p>
              <span>{{ $t('general.balance') }}: </span>
              <span>{{ balance }} {{ depositAssetSymbol }}</span>
            </p>
            <nuxt-link v-if="isBasilisk" :to="`/${currentChain}/assets`">
              {{ $t('general.tx.feesPaidIn', [depositAssetSymbol]) }}
            </nuxt-link>
          </div>
        </NeoField>
      </div>

      <hr class="my-6" />

      <!-- create collection button -->
      <NeoField>
        <div>
          <NeoButton
            expanded
            :label="`${canDeposit ? 'Create Collection' : 'Not Enough Funds'}`"
            type="submit"
            size="medium"
            :loading="isLoading"
            :disabled="!canDeposit" />

          <div v-if="isBasilisk || isAssetHub" class="p-4 is-flex">
            <NeoIcon icon="circle-info" size="medium" class="mr-4" />
            <p class="is-size-7">
              A deposit of
              <strong>{{ collectionDeposit }} {{ depositAssetSymbol }}</strong>
              is required to create a collection. Please note, this initial
              deposit is refundable.
              <a
                href="https://hello.kodadot.xyz/multi-chain/fees"
                target="_blank"
                class="has-text-link"
                rel="nofollow noopener noreferrer">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </NeoField>
    </form>
  </div>
</template>

<script setup lang="ts">
import type {
  CollectionToMintBasilisk,
  CollectionToMintKusama,
  CollectionToMintStatmine,
} from '@/composables/transaction/types'
import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSelect,
  NeoSwitch,
} from '@kodadot1/brick'
import DropUpload from '@/components/shared/DropUpload.vue'
import { availablePrefixes, depositAmount } from '@/utils/chain'
import { Interaction } from '@kodadot1/minimark/v1'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  getAssetIdByAccount,
  getAssetMetadataById,
  getKusamaAssetId,
} from '@/utils/api/bsx/query'
import { balanceOf } from '@kodadot1/sub-api'
import { CHAINS, Prefix } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import format from '@/utils/format/balance'

// composables
const { accountId } = useAuth()
const { apiInstanceByPrefix } = useApi()
const { transaction, status, isLoading } = useTransaction()
const { urlPrefix, setUrlPrefix, assets } = usePrefix()

// form state
const logo = ref<File | null>(null)
const name = ref('')
const description = ref('')
const unlimited = ref(true)
const max = ref(1)
const symbol = ref('')

// balance state
const balance = ref()
const collectionDeposit = ref()
const canDeposit = computed(() => {
  return parseFloat(balance.value) >= parseFloat(collectionDeposit.value)
})

const depositTokenId = ref()
const depositSymbol = ref()
const depositAsset = computed(() => assets(depositTokenId.value))
const depositAssetSymbol = computed(
  () => depositSymbol.value || depositAsset.value.symbol
)

const menus = availablePrefixes().filter(
  (menu) => menu.value !== 'movr' && menu.value !== 'glmr'
)
const chainByPrefix = menus.find((menu) => menu.value === urlPrefix.value)
const selectBlockchain = ref(chainByPrefix?.value || menus[0].value)

const currentChain = computed(() => {
  return selectBlockchain.value as string
})

watchEffect(() => setUrlPrefix(currentChain.value as Prefix))

const isKusama = computed(
  () => currentChain.value === 'ksm' || currentChain.value === 'rmrk'
)

const isBasilisk = computed(
  () => currentChain.value === 'bsx' || currentChain.value === 'snek'
)

const isAssetHub = computed(
  () => currentChain.value === 'ahk' || currentChain.value === 'ahp'
)

const createCollection = async () => {
  let collection:
    | CollectionToMintBasilisk
    | CollectionToMintKusama
    | CollectionToMintStatmine = {
    file: logo.value,
    name: name.value,
    description: description.value,
    nftCount: unlimited.value ? 0 : max.value,
  }

  if (isBasilisk.value) {
    collection['tags'] = []
  }

  if (isKusama.value) {
    collection['symbol'] = symbol.value
  }

  if (collectionDeposit.value && canDeposit.value === false) {
    return
  }

  try {
    showNotification(
      `Creating Collection: "${name.value}"`,
      notificationTypes.info
    )
    isLoading.value = true

    await transaction(
      {
        interaction: Interaction.MINT,
        urlPrefix: currentChain.value,
        collection,
      },
      currentChain.value
    )
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    console.error(error)
  }
}

watchEffect(async () => {
  collectionDeposit.value = 0
  collectionDeposit.value = depositAmount[currentChain.value]?.collection || 0
})

watchEffect(async () => {
  balance.value = 0
  depositTokenId.value = 0
  depositSymbol.value = ''

  const api = await apiInstanceByPrefix(currentChain.value)
  const currentAddress = accountId.value
  const chain = CHAINS[currentChain.value]
  const publicKey = decodeAddress(currentAddress)
  const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
  const chainInfo = await api.registry.getChainProperties()

  balance.value = await balanceOf(api, prefixAddress)

  if (isBasilisk.value) {
    depositTokenId.value = await getAssetIdByAccount(api, accountId.value)
    depositSymbol.value = (
      await getAssetMetadataById(api, depositTokenId.value)
    ).symbol

    if (depositAssetSymbol.value === 'KSM') {
      balance.value = (
        (await api.query.tokens.accounts(
          prefixAddress,
          getKusamaAssetId(currentChain.value)
        )) as PalletBalancesAccountData
      ).free.toString()
    }
  } else {
    depositSymbol.value = chainInfo?.tokenSymbol?.toHuman()?.[0]
  }

  balance.value = format(balance.value, chain.tokenDecimals, false)
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.o-field:not(:last-child) {
  margin-bottom: 2rem;
}

.file {
  margin-bottom: 0;
}

.column {
  max-width: 36rem;
  padding: 4rem;

  @include desktop() {
    @include ktheme() {
      background-color: theme('background-color');
      box-shadow: theme('primary-shadow');
    }
  }

  @include touch() {
    padding: 0 1rem;
    box-shadow: none !important;
  }
}

@include desktop() {
  .columns {
    padding: 5.25rem 0;

    @include ktheme() {
      background-color: theme('k-primaryLight');
    }
  }
}
</style>

<template>
  <section>
    <div class="container">
      <div class="columns is-centered">
        <Loader v-model="isLoading" :status="status" />
        <form class="column is-half" @submit.prevent="createCollection">
          <h2 class="title is-size-3">
            {{ $t('mint.collection.create') }}
          </h2>

          <!-- select blockchain -->
          <NeoField :label="`${$t('mint.blockchain.label')} *`">
            <div>
              <p>{{ $t('mint.blockchain.message') }}</p>
              <NeoDropdown v-model="selectBlockchain" class="mt-3" expanded>
                <template #trigger>
                  <NeoButton variant="primary" type="button" expanded>
                    {{ selectBlockchain.text }}
                    <NeoIcon icon="caret-down"></NeoIcon>
                  </NeoButton>
                </template>

                <NeoDropdownItem
                  v-for="(menu, index) in menus"
                  :key="index"
                  :value="menu"
                  aria-role="listitem">
                  <div class="is-flex is-align-items-center">
                    <img
                      :src="menu.icon"
                      :alt="menu.text"
                      width="32px"
                      class="is-inline-block mr-2" />
                    <div>
                      <span>{{ menu.text }}</span>
                    </div>
                  </div>
                </NeoDropdownItem>
              </NeoDropdown>
            </div>
          </NeoField>

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

          <div v-if="isBasilisk || isAssetHub">
            <hr class="my-6" />
            <NeoField>
              <div class="monospace">
                <p class="has-text-weight-medium is-size-6 has-text-info">
                  <span>{{ $t('mint.deposit') }}:</span>
                  <span>{{ collectionDeposit }} {{ balanceSymbol }}</span>
                </p>
                <p>
                  <span>{{ $t('general.balance') }}: </span>
                  <span>{{ balance }} {{ balanceSymbol }}</span>
                </p>
              </div>
            </NeoField>
          </div>

          <hr class="my-6" />

          <!-- create collection button -->
          <NeoField
            variant="danger"
            :message="`${canDeposit ? '' : $t('tooltip.notEnoughBalance')}`">
            <SubmitButton
              expanded
              label="create collection"
              type="submit"
              :loading="isLoading"
              :disabled="!canDeposit" />
          </NeoField>
        </form>
      </div>
    </div>
  </section>
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
  NeoDropdown,
  NeoDropdownItem,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSwitch,
} from '@kodadot1/brick'
import DropUpload from '@/components/shared/DropUpload.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import { availablePrefixWithIcon, depositAmount } from '@/utils/chain'
import { Interaction } from '@kodadot1/minimark/v1'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { balanceOf } from '@kodadot1/sub-api'
import { CHAINS } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import format from '@/utils/format/balance'

// composables
const { accountId } = useAuth()
const { apiInstanceByPrefix } = useApi()
const { transaction, status, isLoading } = useTransaction()

// form state
const logo = ref<File | null>(null)
const name = ref('')
const description = ref('')
const unlimited = ref(true)
const max = ref(1)
const symbol = ref('')

// balance state
const balance = ref()
const balanceSymbol = ref()
const collectionDeposit = ref()
const canDeposit = computed(() => {
  return parseFloat(balance.value) >= parseFloat(collectionDeposit.value)
})

const menus = availablePrefixWithIcon().filter(
  (menu) => menu.value !== 'movr' && menu.value !== 'glmr'
)
const selectBlockchain = ref(menus[0])
const currentChain = computed(() => {
  return selectBlockchain.value.value as string
})

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

  const api = await apiInstanceByPrefix(currentChain.value)
  const currentAddress = accountId.value
  const chain = CHAINS[currentChain.value]
  const publicKey = decodeAddress(currentAddress)
  const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
  const chainInfo = await api.registry.getChainProperties()

  let tokenId

  if (currentChain.value === 'bsx') {
    tokenId = getKusamaAssetId(currentChain.value)
  }

  if (tokenId) {
    balance.value = (
      (await api.query.tokens.accounts(
        prefixAddress,
        tokenId
      )) as PalletBalancesAccountData
    ).free.toString()
  } else {
    balance.value = await balanceOf(api, prefixAddress)
  }

  balance.value = format(balance.value, chain.tokenDecimals, false)
  balanceSymbol.value = chainInfo?.tokenSymbol?.toHuman()?.[0]
})
</script>

<style lang="scss">
.o-field:not(:last-child) {
  margin-bottom: 2rem;
}

.file {
  margin-bottom: 0;
}
</style>

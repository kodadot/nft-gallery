<template>
  <div class="is-centered" :class="{ columns: classColumn }">
    <Loader v-if="!autoTeleport" v-model="isLoading" :status="status" />
    <MintConfirmModal
      v-model="confirmModal"
      :auto-teleport-actions="actions"
      :nft-information="collectionInformation"
      @confirm="handleCreateCollectionConfirmation" />
    <form
      class="is-half"
      :class="{ column: classColumn }"
      @submit.prevent="showConfirm">
      <h1 class="title is-size-3 mb-7">
        {{ $t('mint.collection.create') }}
      </h1>

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
        data-testid="collection-name"
        :error="!name">
        <NeoInput
          v-model="name"
          required
          :placeholder="$t('mint.collection.name.placeholder')" />
      </NeoField>

      <!-- collection description -->
      <NeoField
        :label="`${$t('mint.collection.description.label')} (optional)`">
        <NeoInput
          v-model="description"
          type="textarea"
          has-counter
          maxlength="1000"
          height="10rem"
          :placeholder="$t('mint.collection.description.placeholder')"
          data-testid="collection-desc" />
      </NeoField>

      <!-- collection max nfts -->
      <NeoField
        :label="$t('Maximum NFTs in collection')"
        data-testid="collection-maxAmount"
        required>
        <div class="w-full">
          <div class="flex justify-between">
            <p>{{ $t('mint.unlimited') }}</p>
            <NeoSwitch v-model="unlimited" position="left" />
          </div>
          <NeoInput
            v-if="!unlimited"
            v-model="max"
            class="mt-3"
            type="number"
            data-testid="collection-input-maximum-nfts"
            placeholder="1 is the minimum"
            :min="1" />
        </div>
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div class="w-full">
          <p>{{ $t('mint.blockchain.message') }}</p>
          <NeoSelect
            v-model="selectBlockchain"
            class="mt-3"
            data-testid="collection-chain"
            expanded>
            <option v-for="menu in menus" :key="menu.value" :value="menu.value">
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <!-- collection symbol -->
      <NeoField
        v-if="isRemark"
        :label="`${$t('mint.collection.symbol.label')} *`">
        <div>
          <p>{{ $t('mint.collection.symbol.message') }}</p>
          <NeoInput
            ref="symbolInput"
            v-model="symbol"
            :placeholder="$t('mint.collection.symbol.placeholder')"
            minlength="3"
            required
            expanded />
        </div>
      </NeoField>

      <!-- royalty -->
      <NeoField v-if="!isRmrk">
        <RoyaltyForm
          v-model:amount="royalty.amount"
          v-model:address="royalty.address"
          data-testid="create-nft-royalty" />
      </NeoField>

      <hr class="my-6" />

      <!-- deposit and balance -->
      <div>
        <div class="flex font-medium has-text-info">
          <div>{{ $t('mint.deposit') }}:&nbsp;</div>
          <div data-testid="collection-deposit">
            {{ totalCollectionDeposit }} {{ chainSymbol }}
          </div>
        </div>
        <div class="flex">
          <div>{{ $t('general.balance') }}:&nbsp;</div>
          <div data-testid="collection-balance">
            {{ balance }} {{ chainSymbol }}
          </div>
        </div>
      </div>

      <hr class="my-6" />

      <!-- create collection button -->
      <NeoButton
        class="is-size-6"
        expanded
        :label="submitButtonLabel"
        native-type="submit"
        size="medium"
        data-testid="collection-create"
        :loading="isLoading" />
      <div class="p-4 flex">
        <NeoIcon icon="circle-info" size="medium" class="mr-4" />
        <p class="text-xs">
          <span
            v-dompurify-html="
              $t('mint.requiredDeposit', [
                `${totalCollectionDeposit} ${chainSymbol}`,
                'collection',
              ])
            " />
          <a
            href="https://hello.kodadot.xyz/multi-chain/fees"
            target="_blank"
            class="has-text-link"
            rel="nofollow noopener noreferrer">
            {{ $t('helper.learnMore') }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type {
  ActionMintCollection,
  BaseCollectionType,
  CollectionToMintBasilisk,
  CollectionToMintKusama,
  CollectionToMintStatmine,
} from '@/composables/transaction/types'
import type { Prefix } from '@kodadot1/static'

import RoyaltyForm from '@/components/bsx/Create/RoyaltyForm.vue'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import MintConfirmModal from '@/components/create/Confirm/MintConfirmModal.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { availablePrefixes } from '@/utils/chain'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSelect,
  NeoSwitch,
} from '@kodadot1/brick'
import { makeSymbol } from '@kodadot1/minimark/shared'
import { Interaction } from '@kodadot1/minimark/v1'

// props
withDefaults(
  defineProps<{
    classColumn?: boolean
  }>(),
  {
    classColumn: true,
  },
)

// composables
const { transaction, status, isLoading, isError, blockNumber } =
  useTransaction()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { $consola, $i18n } = useNuxtApp()
const { isLogIn, accountId } = useAuth()

// form state
const logo = ref<File | null>(null)
const name = ref('')
const description = ref('')
const unlimited = ref(true)
const max = ref(1)
const symbol = ref('')
const confirmModal = ref(false)
const autoTeleport = ref(false)
const royalty = ref({
  amount: 0,
  address: accountId.value,
})

const menus = availablePrefixes()

const chainByPrefix = menus.find((menu) => menu.value === urlPrefix.value)
const selectBlockchain = ref(chainByPrefix?.value || menus[0].value)

watch(urlPrefix, (value) => {
  selectBlockchain.value = value
})

const submitButtonLabel = computed(() => {
  return !isLogIn.value
    ? $i18n.t('mint.nft.connect')
    : canDeposit.value
      ? $i18n.t('mint.collection.create')
      : $i18n.t('confirmPurchase.notEnoughFuns')
})

const currentChain = computed(() => {
  return selectBlockchain.value as Prefix
})

const { isAssetHub, isRemark, isRmrk } = useIsChain(currentChain)
const { balance, totalCollectionDeposit, chainSymbol, chain } =
  useDeposit(currentChain)

// balance state
const canDeposit = computed(() => {
  return (
    isLogIn.value &&
    parseFloat(balance.value) >= parseFloat(totalCollectionDeposit.value)
  )
})

const collectionInformation = computed(() => ({
  file: logo.value,
  name: name.value,
  paidToken: chain.value,
  mintType: CreateComponent.Collection,
}))

watch(currentChain, () => {
  royalty.value.amount = 0
  if (currentChain.value !== urlPrefix.value) {
    setUrlPrefix(currentChain.value as Prefix)
  }
})

const showConfirm = () => {
  confirmModal.value = true
}

const collection = computed(() => {
  let collection: BaseCollectionType = {
    file: logo.value,
    name: name.value,
    description: description.value,
    hasRoyalty: Boolean(royalty.value.amount),
    royalty: royalty.value,
  }

  if (isAssetHub.value) {
    collection['nftCount'] = unlimited.value ? 0 : max.value
  }

  if (isRemark.value) {
    collection['symbol'] = symbol.value
    collection['nftCount'] = unlimited.value ? 0 : max.value
  }

  return collection
})

const mintCollectionAction = computed<ActionMintCollection>(() => ({
  interaction: Interaction.MINT,
  urlPrefix: currentChain.value,
  collection: collection.value as
    | CollectionToMintBasilisk
    | CollectionToMintKusama
    | CollectionToMintStatmine,
}))

const handleCreateCollectionConfirmation = async ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  confirmModal.value = false
  autoTeleport.value = autoteleport

  if (autoteleport) {
    return
  }

  if (totalCollectionDeposit.value && canDeposit.value === false) {
    return
  }

  await createCollection()
}

const createCollection = async () => {
  try {
    isLoading.value = true

    await transaction(mintCollectionAction.value, currentChain.value)
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    $consola.error(error)
  }
}

// autoteleport
const actions = computed<AutoTeleportAction[]>(() => [
  {
    action: mintCollectionAction.value,
    prefix: currentChain.value,
    handler: createCollection,
    details: {
      isLoading: isLoading.value,
      isError: isError.value,
      status: status.value,
      blockNumber: blockNumber.value,
    },
  },
])

onMounted(() => {
  symbol.value = makeSymbol()
})
</script>

<style lang="scss" scoped src="@/assets/styles/pages/create.scss"></style>

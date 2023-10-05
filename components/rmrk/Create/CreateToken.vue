<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm
      ref="baseTokenForm"
      v-model="base"
      :collections="collections"
      :show-explainer-text="showExplainerText">
      <template #main>
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BasicSwitch key="listed" v-model="listed" label="mint.listForSale" />

        <BalanceInput
          v-if="listed"
          ref="balanceInput"
          key="price"
          label="Price"
          expanded
          required
          :has-to-larger-than-zero="listed"
          :step="0.1"
          class="mb-3"
          @input="updatePrice" />

        <div v-show="base.selectedCollection" key="attributes">
          <CustomAttributeInput
            v-model="tags"
            :max="10"
            class="mb-3"
            visible="collapse.collection.attributes.show"
            hidden="collapse.collection.attributes.hide" />
        </div>

        <NeoMessage
          v-if="hasPrice"
          key="message"
          type="is-primary"
          has-icon
          icon="exclamation-triangle">
          {{ $t('warning.newTransactionWhilePriceSet') }}
        </NeoMessage>

        <template v-if="version === '2.0.0'">
          <BasicSwitch
            key="hasRoyalty"
            v-model="hasRoyalty"
            label="mint.listWithRoyalty" />
          <RoyaltyForm v-if="hasRoyalty" key="royalty" v-model="royalty" />
        </template>
      </template>
      <template #footer>
        <NeoField key="advanced">
          <CollapseWrapper
            v-if="base.copies > 1"
            visible="mint.expert.show"
            hidden="mint.expert.hide"
            class="mt-3">
            <BasicSwitch
              v-model="postfix"
              class="mt-3"
              label="mint.expert.postfix" />
          </CollapseWrapper>
        </NeoField>
        <NeoField
          v-if="isLogIn"
          key="submit"
          variant="danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="mint.submit"
            :loading="isLoading"
            @click="submit()" />
        </NeoField>
      </template>
    </BaseTokenForm>
  </div>
</template>

<script setup lang="ts">
import collectionForMint from '@/queries/subsquid/rmrk/collectionForMint.graphql'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import {
  notificationTypes,
  showNotification,
  warningMessage,
} from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import { CreatedNFT as CreatedNFTV2 } from '@kodadot1/minimark/v2'
import { Attribute } from '@kodadot1/minimark/common'
import { formatBalance } from '@polkadot/util'
import { unwrapSafe } from '@/utils/uniquery'
import { toNFTId } from '../service/scheme'
import { Ref as RefType } from 'vue'
import { Royalty } from '@/utils/royalty'
import { NeoField, NeoMessage } from '@kodadot1/brick'
import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'
import CollapseWrapper from '@/components/shared/collapse/CollapseWrapper.vue'
import Loader from '@/components/shared/Loader.vue'
import BalanceInput from '@/components/shared/BalanceInput.vue'
import BaseTokenForm from '@/components/base/BaseTokenForm.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import RoyaltyForm from '@/components/bsx/Create/RoyaltyForm.vue'

import type { BaseTokenType } from '@/components/base/types'
import type {
  MintedCollectionKusama,
  TokenToList,
} from '@/composables/transaction/types'

const { isLoading, status } = useMetaTransaction()
const { $i18n } = useNuxtApp()
const { accountId, isLogIn, balance } = useAuth()
const { client } = usePrefix()
const { urlPrefix } = usePrefix()
const { unit, decimals } = useChain()
const router = useRouter()

const base = ref({
  name: '',
  file: null,
  description: '',
  selectedCollection: null,
  copies: 1,
  secondFile: null,
} as BaseTokenType<MintedCollectionKusama>)

const collections = ref([] as MintedCollectionKusama[])
const tags = ref([] as Attribute[])
const price = ref(0 as string | number)
const nsfw = ref(false)
const listed = ref(true)
const postfix = ref(true)
const balanceNotEnough = ref(false)

const hasRoyalty = ref(true)
const royalty = ref({
  amount: 0.15,
  address: '',
} as Royalty)

const balanceInput = ref()
const baseTokenForm = ref()

defineProps({
  showExplainerText: {
    type: Boolean,
    default: false,
  },
})

const version = computed(() => {
  return useRmrkVersion().version.value
})

const hasPrice = computed(() => {
  return Number(price.value)
})

const balanceNotEnoughMessage = computed(() => {
  return balanceNotEnough.value ? $i18n.t('tooltip.notEnoughBalance') : ''
})

const updatePrice = (value: string) => {
  price.value = value
}

const fetchCollections = async () => {
  const { data: _collections } = await useAsyncQuery({
    query: collectionForMint,
    variables: {
      account: accountId.value,
    },
    clientId: client.value,
  })
  const { collectionEntities } = _collections.value

  collections.value = unwrapSafe(collectionEntities)
    ?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.length,
      lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
      totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
    }))
    .filter(
      (ce: MintedCollectionKusama) =>
        (ce.max || Infinity) - ce.alreadyMinted > 0,
    )
}

const checkValidity = () => {
  const balanceInputValid = !listed.value || balanceInput.value.checkValidity()
  const baseTokenFormValid = baseTokenForm.value.checkValidity()
  return balanceInputValid && baseTokenFormValid
}

const submit = async () => {
  if (!base.value.selectedCollection) {
    throw ReferenceError('[MINT] Unable to mint without collection')
  }

  if (!checkValidity()) {
    return
  }

  if (parseFloat(balance.value) === 0) {
    balanceNotEnough.value = true
    return
  }

  isLoading.value = true
  status.value = 'loader.ipfs'
  const {
    transaction,
    status: transactionStatus,
    isLoading: transactionIsLoading,
    blockNumber,
  } = useTransaction()

  watch([transactionIsLoading, transactionStatus], () => {
    isLoading.value = transactionIsLoading.value
    if (transactionStatus.value) {
      status.value = transactionStatus.value
    }
  })

  try {
    const { createdNFTs } = (await transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: {
        ...base.value,
        copies: Number(base.value.copies),
        tags: tags.value,
        nsfw: nsfw.value,
        postfix: postfix.value,
        price: price.toString(),
        royalty: royalty.value,
        hasRoyalty: hasRoyalty.value,
      },
    })) as {
      createdNFTs: RefType<CreatedNFT[]>
    }

    watch([blockNumber, createdNFTs], () => {
      if (blockNumber.value && createdNFTs.value) {
        const isJustNftMint = !listed.value
        if (isJustNftMint) {
          setTimeout(
            () =>
              handleCreatedNftsRedirect(
                createdNFTs.value,
                blockNumber.value as string,
              ),
            300,
          )
        } else if (hasPrice.value) {
          setTimeout(
            () => listForSale(createdNFTs.value, blockNumber.value as string),
            300,
          )
        }
      }
    })
  } catch (e) {
    if (e instanceof Error) {
      warningMessage(e)
    }
  }
}

const listForSale = async (
  createdNFT: CreatedNFT[] | CreatedNFTV2[],
  originalBlockNumber: string,
) => {
  try {
    const {
      transaction,
      status: transactionStatus,
      isLoading: transactionIsLoading,
      blockNumber,
    } = useTransaction()

    watch([transactionIsLoading, transactionStatus], () => {
      isLoading.value = transactionIsLoading.value
      if (transactionStatus.value) {
        status.value = transactionStatus.value
      }
    })

    const balance = formatBalance(price.value, {
      decimals: decimals.value,
      withUnit: unit.value,
    })

    if (!createdNFT) {
      showNotification('Can not list empty NFTs', notificationTypes.warn)
      return
    }

    showNotification(`[💰] Listing NFT to sale for ${balance}`)
    const list: TokenToList[] = createdNFT.map((nft) => ({
      price: price.value.toString(),
      nftId: toNFTId(nft, originalBlockNumber),
    }))

    isLoading.value = true
    transaction({
      interaction: Interaction.LIST,
      urlPrefix: urlPrefix.value,
      token: list,

      successMessage: (blockNumber) =>
        `[💰] Listed ${base.value.name} for ${balance} in block ${blockNumber}`,
    })

    watch([transactionIsLoading, blockNumber], () => {
      if (!transactionIsLoading.value && blockNumber.value) {
        handleCreatedNftsRedirect(createdNFT, originalBlockNumber)
      }
    })
  } catch (e) {
    showNotification((e as Error).message, notificationTypes.warn)
  }
}

const handleCreatedNftsRedirect = (
  createdNFT: CreatedNFT[] | CreatedNFTV2[],
  originalBlockNumber: string,
) => {
  const nfts = createdNFT.map((nft) => toNFTId(nft, originalBlockNumber))

  const isSingle = nfts.length === 1

  navigateToDetail({
    pageId: isSingle ? nfts[0] : (base.value.selectedCollection?.id as string),
    nftName: base.value.name,
    toCollectionPage: !isSingle,
  })
}

const navigateToDetail = ({
  pageId,
  nftName,
  toCollectionPage,
}: {
  pageId: string
  nftName: string
  toCollectionPage: boolean
}) => {
  showNotification(
    `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`,
  )
  const subPath = toCollectionPage ? 'collection' : 'gallery'
  const go = () => {
    const navigateTo = {
      path: `/${urlPrefix.value}/${subPath}/${pageId}`,
    }
    if (!toCollectionPage) {
      navigateTo.query = { congratsNft: nftName }
    }
    return router.push(navigateTo)
  }
  setTimeout(go, DETAIL_TIMEOUT)
}

watch(
  accountId,
  (value, oldVal) => {
    if (shouldUpdate(value, oldVal)) {
      fetchCollections()
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm
      v-bind.sync="base"
      ref="baseTokenForm"
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
          <RoyaltyForm v-if="hasRoyalty" key="royalty" v-bind.sync="royalty" />
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
import { BaseTokenType } from '@/components/base/types'
import collectionForMint from '@/queries/subsquid/rmrk/collectionForMint.graphql'
import { Location } from 'vue-router/types/router'
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
import {
  MintedCollectionKusama,
  TokenToList,
} from '@/composables/transaction/types'
import { NeoField, NeoMessage } from '@kodadot1/brick'

import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'
import CollapseWrapper from '@/components/shared/collapse/CollapseWrapper.vue'
import Loader from '@/components/shared/Loader.vue'
import BalanceInput from '@/components/shared/BalanceInput.vue'
import BaseTokenForm from '@/components/base/BaseTokenForm.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import RoyaltyForm from '@/components/bsx/Create/RoyaltyForm.vue'

const base: BaseTokenType<MintedCollectionKusama> = {
  name: '',
  file: null,
  description: '',
  selectedCollection: null,
  copies: 1,
  secondFile: null,
}

const collections = ref([] as MintedCollectionKusama[])
const tags: Attribute[] = []
const price = ref(0 as string | number)
const nsfw = false
const listed = true
const postfix = true
const balanceNotEnough = ref(false)

const hasRoyalty = true
const royalty: Royalty = {
  amount: 0.15,
  address: '',
}

const isLoading = ref(false)
const status = ref()

const balanceInput = ref()
const baseTokenForm = ref()
defineProps({
  showExplainerText: {
    type: Boolean,
    default: false,
  },
})

const updatePrice = (value: string) => {
  price.value = value
}

const version = computed(() => {
  return useRmrkVersion().version.value
})

const hasPrice = computed(() => {
  return Number(price.value)
})

const { $i18n, $apollo } = useNuxtApp()

const balanceNotEnoughMessage = computed(() => {
  return balanceNotEnough ? $i18n.t('tooltip.notEnoughBalance') : ''
})

const { accountId, isLogIn, balance } = useAuth()

watch(
  accountId,
  (value, oldVal) => {
    if (shouldUpdate(value, oldVal)) {
      fetchCollections()
    }
  },
  {
    immediate: true,
  }
)

const { client } = usePrefix()

const fetchCollections = async () => {
  const _collections = await $apollo.query({
    query: collectionForMint,
    client: client.value,
    variables: {
      account: accountId.value,
    },
    fetchPolicy: 'network-only',
  })

  const {
    data: { collectionEntities },
  } = _collections

  collections.value = unwrapSafe(collectionEntities)
    ?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.length,
      lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
      totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
    }))
    .filter(
      (ce: MintedCollectionKusama) =>
        (ce.max || Infinity) - ce.alreadyMinted > 0
    )
}

const checkValidity = () => {
  const balanceInputValid = !listed || balanceInput.value.checkValidity()
  const baseTokenFormValid = baseTokenForm.value.checkValidity()
  return balanceInputValid && baseTokenFormValid
}

const submit = async () => {
  if (!base.selectedCollection) {
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
  const { urlPrefix } = usePrefix()
  const {
    transaction,
    status: transactionStatus,
    isLoading: transactionIsLoading,
    blockNumber,
  } = useTransaction()

  watch([transactionIsLoading, transactionStatus], () => {
    isLoading.value = transactionIsLoading.value
    if (Boolean(transactionStatus.value)) {
      status.value = transactionStatus.value
    }
  })

  try {
    const { createdNFTs } = (await transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: {
        ...base,
        copies: Number(base.copies),
        tags: tags,
        nsfw: nsfw,
        postfix: postfix,
        price: price.toString(),
        royalty: royalty,
        hasRoyalty: hasRoyalty,
      },
    })) as {
      createdNFTs: RefType<CreatedNFT[]>
    }

    watch([blockNumber, createdNFTs], () => {
      if (blockNumber.value && createdNFTs.value) {
        const isJustNftMint = !listed
        if (isJustNftMint) {
          setTimeout(
            () =>
              handleCreatedNftsRedirect(
                createdNFTs.value,
                blockNumber.value as string
              ),
            300
          )
        } else if (hasPrice) {
          setTimeout(
            () => listForSale(createdNFTs.value, blockNumber.value as string),
            300
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

const { urlPrefix } = usePrefix()
const { unit, decimals } = useChain()

const listForSale = async (
  createdNFT: CreatedNFT[] | CreatedNFTV2[],
  originalBlockNumber: string
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
      if (Boolean(transactionStatus.value)) {
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
        `[💰] Listed ${base.name} for ${balance} in block ${blockNumber}`,
    })

    watch([isLoading, blockNumber], () => {
      if (!isLoading.value && blockNumber.value) {
        handleCreatedNftsRedirect(createdNFT, originalBlockNumber)
      }
    })
  } catch (e) {
    showNotification((e as Error).message, notificationTypes.warn)
  }
}

const handleCreatedNftsRedirect = (
  createdNFT: CreatedNFT[] | CreatedNFTV2[],
  originalBlockNumber: string
) => {
  const nfts = createdNFT.map((nft) => toNFTId(nft, originalBlockNumber))

  const isSingle = nfts.length === 1

  navigateToDetail({
    pageId: isSingle ? nfts[0] : (base.selectedCollection?.id as string),
    nftName: base.name,
    toCollectionPage: !isSingle,
  })
}

const router = useRouter()

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
    `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
  )
  const subPath = toCollectionPage ? 'collection' : 'gallery'
  const go = () => {
    const navigateTo: Location = {
      path: `/${urlPrefix.value}/${subPath}/${pageId}`,
    }
    if (!toCollectionPage) {
      navigateTo.query = { congratsNft: nftName }
    }
    return router.push(navigateTo)
  }
  setTimeout(go, DETAIL_TIMEOUT)
}
</script>

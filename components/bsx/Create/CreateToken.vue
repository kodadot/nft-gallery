<template>
  <div>
    <Loader
      v-model="isTransactionLoading"
      :status="transactionStatus"
      can-cancel />
    <BaseTokenForm
      ref="baseTokenForm"
      :show-explainer-text="showExplainerText"
      v-bind.sync="base"
      :collections="collections"
      :has-edition="false">
      <template #main>
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BasicSwitch key="listed" v-model="listed" label="mint.listForSale" />
        <TokenBalanceInput
          v-if="listed"
          ref="balanceInput"
          key="token-price"
          v-model="price"
          :token-id="tokenId"
          :prefix="urlPrefix"
          class="mb-3" />

        <div v-show="base.selectedCollection" key="attributes">
          <CustomAttributeInput
            v-model="attributes"
            :max="10"
            class="mb-3"
            visible="collapse.collection.attributes.show"
            hidden="collapse.collection.attributes.hide" />
        </div>

        <BasicSwitch
          key="hasRoyalty"
          v-model="hasRoyalty"
          label="mint.listWithRoyalty" />
        <RoyaltyForm v-if="hasRoyalty" key="royalty" v-bind.sync="royalty" />
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
        <NeoField key="deposit">
          <p class="has-text-weight-medium is-size-6 has-text-info">
            {{ $t('mint.deposit') }}:
            <Money :value="deposit" :token-id="tokenId" inline />
          </p>
        </NeoField>
        <NeoField key="balance">
          <AccountBalance />
        </NeoField>
        <NeoField key="token">
          <MultiPaymentFeeButton :account-id="accountId" :prefix="urlPrefix" />
        </NeoField>
        <NeoField
          key="submit"
          variant="danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="mint.submit"
            :loading="isTransactionLoading"
            @click="submit()" />
        </NeoField>
      </template>
    </BaseTokenForm>
  </div>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { Interaction } from '@kodadot1/minimark/v1'
import { Attribute } from '@kodadot1/minimark/common'
import { onApiConnect } from '@kodadot1/sub-api'
import { BaseTokenType } from '@/components/base/types'
import {
  getInstanceDeposit,
  getMetadataDeposit,
} from '@/components/unique/apiConstants'
import { createTokenId } from '@/components/unique/utils'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'
import { Royalty } from '@/utils/royalty'
import { fetchCollectionMetadata } from '@/utils/ipfs'
import { CollectionMetadata } from '@/components/rmrk/types'
import { Token, getBalance, getDeposit, getFeesToken } from './utils'
import { MintedCollection } from '@/composables/transaction/types'
import { NeoField } from '@kodadot1/brick'
import type TokenBalanceInputComponent from '@/components/bsx/input/TokenBalanceInput.vue'
import type BaseTokenFormComponent from '@/components/base/BaseTokenForm.vue'

const { $i18n, $apollo, $consola, $router } = useNuxtApp()

const CustomAttributeInput = () =>
  import('@/components/rmrk/Create/CustomAttributeInput.vue')
const CollapseWrapper = () =>
  import('@/components/shared/collapse/CollapseWrapper.vue')
const Loader = () => import('@/components/shared/Loader.vue')
const BasicSwitch = () => import('@/components/shared/form/BasicSwitch.vue')
const RoyaltyForm = () => import('@/components/bsx/Create/RoyaltyForm.vue')
const Money = () => import('@/components/bsx/format/TokenMoney.vue')
const SubmitButton = () => import('@/components/base/SubmitButton.vue')
const AccountBalance = () => import('@/components/shared/AccountBalance.vue')
const MultiPaymentFeeButton = () =>
  import('@/components/bsx/specific/MultiPaymentFeeButton.vue')
const TokenBalanceInput = () =>
  import('@/components/bsx/input/TokenBalanceInput.vue')

withDefaults(
  defineProps<{
    showExplainerText?: boolean
  }>(),
  {
    showExplainerText: false,
  }
)

const { apiUrl } = useApi()
const { urlPrefix, tokenId } = usePrefix()
const { accountId } = useAuth()
const {
  status: transactionStatus,
  isLoading: isTransactionLoading,
  stopLoader: stopTransactionLoader,
} = useTransactionStatus()

onApiConnect(apiUrl.value, (api) => {
  const instanceDeposit = getInstanceDeposit(api)
  const metadataDeposit = getMetadataDeposit(api)
  deposit.value = (instanceDeposit + metadataDeposit).toString()
})

const base = ref<BaseTokenType>({
  name: '',
  file: null,
  description: '',
  selectedCollection: null,
  copies: 1,
  secondFile: null,
})
const collections = ref<MintedCollection[]>([])
const postfix = ref(true)
const deposit = ref('0')
const attributes = ref<Attribute[]>([])
const nsfw = ref(false)
const price = ref('0')
const listed = ref(false)
const hasRoyalty = ref(true)
const feesToken = ref<Token>('BSX')
const royalty = ref<Royalty>({
  amount: 0.15,
  address: accountId.value,
})
const balanceNotEnough = ref(false)

const balanceInput = ref<typeof TokenBalanceInputComponent | null>(null)
const baseTokenForm = ref<typeof BaseTokenFormComponent | null>(null)

watch(price, (value) => {
  price.value = value
  balanceInput.value?.checkValidity()
})

const balanceOfToken = computed(() => getBalance(feesToken.value))
const depositOfToken = computed(() =>
  getDeposit(feesToken.value, parseFloat(deposit.value))
)
const balanceNotEnoughMessage = computed(() => {
  if (balanceNotEnough.value) {
    return $i18n.t('tooltip.notEnoughBalance')
  }
  return ''
})

const loadCollectionMeta = async () => {
  const metadata = collections.value.map(({ metadata }) => metadata)

  metadata.forEach(async (m, i) => {
    try {
      const meta = await fetchCollectionMetadata(collections[i])
      Object.keys(meta).forEach((key) => {
        collections.value[i][key] = meta[key]
      })
    } catch (e) {
      $consola.warn('[ERR] unable to get metadata')
    }
  })
}

const fetchCollections = async () => {
  const query = await resolveQueryPath(urlPrefix.value, 'collectionForMint')
  const newCollections = await $apollo.query({
    query: query.default,
    client: urlPrefix.value,
    variables: {
      account: accountId.value,
    },
    fetchPolicy: 'network-only',
  })

  const {
    data: { collectionEntities },
  } = newCollections

  const initialMeta: Partial<CollectionMetadata> = {
    description: undefined,
    attributes: undefined,
    image: undefined,
    image_data: undefined,
    external_url: undefined,
  }

  collections.value = unwrapSafe(collectionEntities)?.map((ce: any) => ({
    ...initialMeta, // set initial meta to get reactivity
    ...ce,
    alreadyMinted: ce.nfts?.length,
    lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
    totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
  }))

  loadCollectionMeta()
}

const checkValidity = () => {
  const balanceInputValid = !listed.value || balanceInput.value?.checkValidity()
  const baseTokenFormValid = baseTokenForm.value?.checkValidity()
  return balanceInputValid && baseTokenFormValid
}

const navigateToDetail = (collection: string, id: string): void => {
  showNotification(
    `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
  )
  const go = () =>
    $router.push({
      path: `/${urlPrefix.value}/gallery/${createTokenId(collection, id)}`,
      query: { congratsNft: base.value.name },
    })
  setTimeout(go, DETAIL_TIMEOUT)
}

const submit = async (retryCount = 0): Promise<void> => {
  if (!base.value.selectedCollection) {
    throw ReferenceError('[MINT] Unable to mint without collection')
  }
  // check fields
  if (!checkValidity()) {
    return
  }
  // check balance
  if (!!deposit.value && balanceOfToken.value < depositOfToken.value) {
    balanceNotEnough.value = true
    return
  }

  isTransactionLoading.value = true
  transactionStatus.value = 'loader.ipfs'
  const {
    alreadyMinted,
    id: collectionId,
    lastIndexUsed,
  } = base.value.selectedCollection
  const nextId = Math.max(lastIndexUsed + 1, alreadyMinted + 1)

  const { transaction, status, isLoading, blockNumber } = useTransaction()
  watch([isLoading, status], () => {
    isTransactionLoading.value = isLoading.value
    if (Boolean(status.value)) {
      transactionStatus.value = status.value
    }
  })
  watch(blockNumber, (block) => {
    if (block) {
      navigateToDetail(collectionId, String(nextId))
    }
  })

  try {
    transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: usePrefix().urlPrefix.value,
      token: {
        ...base.value,
        nsfw: nsfw.value,
        price: price.value,
        postfix: postfix.value,
        tags: attributes.value,
        royalty: royalty.value,
        hasRoyalty: hasRoyalty.value,
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      stopTransactionLoader()

      if (retryCount < 3) {
        // retry
        showNotification('Retrying to complete minting process.')
        submit(retryCount + 1)
      } else {
        // finally fail
        showNotification(e.toString(), notificationTypes.warn)
      }
    }
  }
}

watch(
  accountId,
  async (value, oldVal) => {
    if (shouldUpdate(value, oldVal)) {
      await fetchCollections()
      feesToken.value = await getFeesToken()
    }
  },
  { immediate: true }
)
</script>

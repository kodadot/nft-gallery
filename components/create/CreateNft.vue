<template>
  <div class="is-centered columns">
    <Loader v-if="!autoTeleport" v-model="isLoading" :status="status" />
    <MintConfirmModal
      v-model="modalShowStatus"
      :auto-teleport-actions="autoTeleportActions"
      :nft-information="nftInformation"
      @confirm="confirm" />
    <form class="is-half column" @submit.prevent="submitHandler">
      <CreateNftPreview
        :name="form.name"
        :collection="selectedCollection?.name"
        :price="form.salePrice"
        :symbol="chainSymbol"
        :chain="currentChain"
        :image="imagePreview" />

      <h1 class="title is-size-3 mb-7">
        {{ $t('mint.nft.create') }}
      </h1>

      <!-- nft art -->
      <NeoField :label="`${$t('mint.nft.art.label')} *`" :addons="false">
        <div>
          <p>{{ $t('mint.nft.art.message') }}</p>
          <DropUpload
            v-model="form.file"
            required
            expanded
            preview
            :label="$t('mint.nft.drop')" />
        </div>
      </NeoField>

      <!-- nft name -->
      <NeoField
        :label="`${$t('mint.nft.name.label')} *`"
        required
        :error="!form.name">
        <NeoInput
          v-model="form.name"
          required
          :placeholder="$t('mint.nft.name.placeholder')" />
      </NeoField>

      <!-- nft description -->
      <NeoField :label="`${$t('mint.nft.description.label')} (optional)`">
        <NeoInput
          v-model="form.description"
          type="textarea"
          has-counter
          maxlength="1000"
          height="10rem"
          :placeholder="$t('mint.nft.description.placeholder')" />
      </NeoField>

      <!-- select collections -->
      <NeoField
        :key="`collection-${currentChain}`"
        ref="chooseCollectionRef"
        :label="`${$t('mint.nft.collection.label')} *`"
        @click="startSelectedCollection = true">
        <div class="w-100">
          <p
            :class="{
              'has-text-danger': startSelectedCollection && !selectedCollection,
            }">
            {{ $t('mint.nft.collection.message') }}
          </p>
          <ChooseCollectionDropdown
            full-width
            no-shadow
            class="mt-3"
            @selected-collection="onCollectionSelected" />
        </div>
      </NeoField>

      <!-- list for sale -->
      <NeoField
        :key="currentChain"
        :label="$t('mint.nft.sale.label')"
        required
        class="sale"
        :class="{ 'sale-on': form.sale }">
        <span aria-hidden="true" class="hidden-sale-label">{{
          $t('mint.nft.sale.label')
        }}</span>

        <div class="w-full">
          <p>{{ $t('mint.nft.sale.message') }}</p>
        </div>
        <NeoSwitch v-model="form.sale" />
      </NeoField>
      <!-- list for sale price -->
      <NeoField
        v-if="form.sale"
        required
        :error="!form.salePrice"
        :label="`${$t('price')} *`">
        <div class="w-full">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <NeoInput
              v-model="form.salePrice"
              type="number"
              step="0.01"
              pattern="[0-9]+([\.,][0-9]+)?"
              placeholder="0.01 is the minimum"
              expanded />
            <div class="form-addons">
              {{ isBasilisk ? 'KSM' : chainSymbol }}
            </div>
          </div>
        </div>
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div class="w-100">
          <p>{{ $t('mint.blockchain.message') }}</p>
          <NeoSelect v-model="selectChain" class="mt-3" expanded required>
            <option v-for="menu in menus" :key="menu.value" :value="menu.value">
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <!-- no of copies -->
      <NeoField :label="`${$t('mint.nft.copies.label')} (optional)`">
        <div class="w-100">
          <p>{{ $t('mint.nft.copies.message') }}</p>
          <NeoInput
            v-model="form.copies"
            class="mt-3"
            type="number"
            placeholder="e.g 10"
            expanded />
          <BasicSwitch
            v-if="form.copies > 1"
            v-model="form.postfix"
            class="mt-3"
            label="mint.expert.postfix" />
        </div>
      </NeoField>

      <!-- nft properties -->
      <NeoField :label="`${$t('tabs.properties')} (optional)`">
        <CustomAttributeInput v-model="form.tags" :max="10" />
      </NeoField>

      <!-- royalty -->
      <NeoField v-if="!isRmrk">
        <RoyaltyForm
          v-model:amount="form.royalty.amount"
          v-model:address="form.royalty.address" />
      </NeoField>

      <!-- explicit content -->
      <NeoField :label="`${$t('mint.nfsw')}`">
        <div class="w-full">
          <p>{{ $t('mint.nfswMessage') }}</p>
        </div>
        <NeoSwitch v-model="form.nsfw" />
      </NeoField>

      <hr class="my-6" />

      <!-- deposit and balance -->
      <div>
        <div class="is-flex has-text-weight-medium has-text-info">
          <div>{{ $t('mint.deposit') }}:&nbsp;</div>
          <div>{{ totalItemDeposit }} {{ chainSymbol }}</div>
        </div>
        <div class="is-flex">
          <div>{{ $t('general.balance') }}:&nbsp;</div>
          <div>{{ balance }} {{ chainSymbol }}</div>
        </div>
        <nuxt-link v-if="isBasilisk" :to="`/${currentChain}/assets`">
          {{ $t('general.tx.feesPaidIn', [chainSymbol]) }}
        </nuxt-link>
      </div>

      <hr class="my-6" />

      <!-- create nft button -->
      <NeoButton
        expanded
        :label="$t('mint.nft.create')"
        class="is-size-6"
        native-type="submit"
        size="medium"
        :loading="isLoading" />
      <div class="p-4 is-flex">
        <NeoIcon icon="circle-info" size="medium" class="mr-4" />
        <p class="is-size-7">
          <span
            v-dompurify-html="
              $t('mint.requiredDeposit', [
                `${totalItemDeposit} ${chainSymbol}`,
                'NFT',
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
import type { Prefix } from '@kodadot1/static'
import type { Ref } from 'vue'
import type { Actions, TokenToList } from '@/composables/transaction/types'
import ChooseCollectionDropdown from '@/components/common/ChooseCollectionDropdown.vue'
import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSelect,
  NeoSwitch,
} from '@kodadot1/brick'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'
import RoyaltyForm from '@/components/bsx/Create/RoyaltyForm.vue'
import CreateNftPreview from './CreateNftPreview.vue'
import MintConfirmModal from '@/components/create/Confirm/MintConfirmModal.vue'
import resolveQueryPath from '@/utils/queryPathResolver'
import { availablePrefixes } from '@/utils/chain'
import { notificationTypes, showNotification } from '@/utils/notification'
import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import { balanceFrom } from '@/utils/balance'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { delay } from '@/utils/fetch'
import { toNFTId } from '@/components/rmrk/service/scheme'
import { AutoTeleportAction } from '@/composables/autoTeleport/useAutoTeleport'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

// composables
const { $consola } = useNuxtApp()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { transaction, status, isLoading, blockNumber, isError } =
  useTransaction()
const router = useRouter()
const { decimals } = useChain()

// form state
const form = reactive({
  file: null,
  name: '',
  description: '',
  collections: null,
  sale: false,
  salePrice: 0,
  copies: 0,
  postfix: false,
  nsfw: false,
  tags: [],
  royalty: {
    amount: 0,
    address: accountId.value,
  },
})

// select collections
const selectedCollection = ref()
const startSelectedCollection = ref<boolean>(false)
const chooseCollectionRef = ref()

const onCollectionSelected = (collection) => {
  selectedCollection.value = collection
}

const modalShowStatus = ref(false)

const nftInformation = computed(() => ({
  file: form.file,
  name: form.name,
  selectedCollection: selectedCollection.value,
  price: balanceFrom(form.salePrice, decimals.value),
  listForSale: form.sale,
  paidToken: chain.value,
  mintType: CreateComponent.NFT,
}))

const imagePreview = computed(() => {
  if (form.file) {
    return URL?.createObjectURL(form.file)
  }
})

// select available blockchain
const menus = availablePrefixes().filter(
  (menu) => menu.value !== 'movr' && menu.value !== 'glmr',
)
const chainByPrefix = computed(() =>
  menus.find((menu) => menu.value === urlPrefix.value),
)
const selectChain = ref(chainByPrefix.value?.value || menus[0].value)

watch(urlPrefix, (value) => {
  selectChain.value = value
})

// get/set current chain/prefix
const currentChain = computed(() => selectChain.value as Prefix)
const { isBasilisk, isRemark, isRmrk } = useIsChain(currentChain)
watch(currentChain, () => {
  // reset some state on chain change
  form.salePrice = 0
  form.royalty.amount = 0

  if (currentChain.value !== urlPrefix.value) {
    setUrlPrefix(currentChain.value as Prefix)
  }
})

// deposit stuff
const { balance, totalItemDeposit, chainSymbol, chain } =
  useDeposit(currentChain)

// create nft
const transactionStatus = ref<
  'list' | 'checkListed' | 'mint' | 'done' | 'idle'
>('idle')
const createdItems = ref()
const mintedBlockNumber = ref()

const mintAction = computed<Actions>(() => ({
  interaction: Interaction.MINTNFT,
  urlPrefix: currentChain.value,
  token: {
    file: form.file,
    name: form.name,
    description: form.description,
    selectedCollection: selectedCollection.value,
    copies: form.copies,
    nsfw: form.nsfw,
    postfix: form.postfix,
    price: balanceFrom(form.salePrice, decimals.value),
    tags: form.tags,
    secondFile: null,
    hasRoyalty: Boolean(form.royalty.amount),
    royalty: form.royalty,
  },
}))

const listAction = computed<Actions>(() => {
  const list: TokenToList[] = createdItems.value?.map((nft) => ({
    price: balanceFrom(form.salePrice, decimals.value),
    nftId: toNFTId(nft, String(blockNumber.value)),
  }))

  return {
    interaction: Interaction.LIST,
    urlPrefix: currentChain.value,
    token: list,
    successMessage: `[💰] Listed ${form.name} for ${form.salePrice} ${chainSymbol.value}`,
  }
})

const submitHandler = () => {
  startSelectedCollection.value = true
  if (selectedCollection.value) {
    toggleConfirm()
  } else {
    ;(chooseCollectionRef.value?.$el as HTMLElement)?.scrollIntoView({
      block: 'center',
    })
  }
}

const toggleConfirm = () => {
  modalShowStatus.value = !modalShowStatus.value
}

const confirm = ({ autoteleport }: AutoTeleportActionButtonConfirmEvent) => {
  toggleConfirm()

  if (!autoteleport) {
    createNft()
  }
}

const needsListing = computed(
  () => isRemark.value && form.sale && form.salePrice,
)

const createNft = async () => {
  try {
    const minted = (await transaction(
      mintAction.value,
      currentChain.value,
    )) as unknown as {
      createdNFTs?: Ref<CreatedNFT[]>
    }
    if (needsListing.value) {
      createdItems.value = minted?.createdNFTs?.value
      transactionStatus.value = 'list'
    } else {
      transactionStatus.value = 'mint'
    }
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    $consola.error(error)
  }
}

// autoteleport stuff
const autoTeleport = ref(false)
const autoTeleportActions = computed<AutoTeleportAction[]>(() => {
  const actions = [
    {
      action: mintAction.value,
      handler: createNft,
      prefix: currentChain.value,
      details: {
        isLoading,
        isError,
        status,
      },
    },
  ]

  if (needsListing.value) {
    actions.push({
      action: listAction.value,
      transaction: transaction,
      prefix: currentChain.value,
      details: {
        isLoading,
        isError,
        status,
      },
    })
  }

  return actions
})

// currently, on rmrk we need to list price manually

watchEffect(async () => {
  if (
    blockNumber.value &&
    createdItems.value &&
    transactionStatus.value === 'list'
  ) {
    try {
      await transaction(listAction.value, currentChain.value)

      transactionStatus.value = 'checkListed'
    } catch (error) {
      showNotification(`[ERR] ${error}`, notificationTypes.warn)
      $consola.error(error)
    }
  }
})

watchEffect(() => {
  // prepare nft blockNumber for redirect to detail page
  if (
    (transactionStatus.value === 'mint' ||
      transactionStatus.value === 'list') &&
    status.value === 'loader.finalized' &&
    blockNumber.value
  ) {
    mintedBlockNumber.value = blockNumber.value
    transactionStatus.value = 'done'
  }

  // if listing price is done, then redirect to detail page
  if (
    transactionStatus.value === 'checkListed' &&
    status.value === 'loader.finalized'
  ) {
    transactionStatus.value = 'done'
  }
})

// navigate to gallery detail page after success create nft
const retry = ref(10) // max retry 10 times

type NftId = {
  nftEntities?: {
    id: string
  }[]
}

async function getNftId() {
  const query = await resolveQueryPath(currentChain.value, 'nftByBlockNumber')
  const { data }: { data: Ref<NftId> } = await useAsyncQuery({
    query: query.default,
    clientId: currentChain.value,
    variables: {
      limit: 1,
      blockNumber: mintedBlockNumber.value,
    },
  })

  return data.value.nftEntities?.[0]?.id
}

watchEffect(async () => {
  if (
    mintedBlockNumber.value &&
    retry.value &&
    transactionStatus.value === 'done'
  ) {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`,
      notificationTypes.info,
      DETAIL_TIMEOUT,
    )

    await delay(DETAIL_TIMEOUT)
    const nftId = await getNftId()

    if (nftId) {
      router.push({
        path: `/${urlPrefix.value}/gallery/${nftId}`,
        query: { congratsNft: form.name },
      })
    } else {
      retry.value -= 1
    }
  }
})
</script>

<style lang="scss" scoped src="@/assets/styles/pages/create.scss"></style>

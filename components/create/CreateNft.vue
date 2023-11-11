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
        :image="imagePreview"
        data-testid="create-nft-preview-box" />

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
          data-testid="create-nft-input-name"
          required
          :placeholder="$t('mint.nft.name.placeholder')" />
      </NeoField>

      <!-- nft description -->
      <NeoField :label="`${$t('mint.nft.description.label')} (optional)`">
        <NeoInput
          v-model="form.description"
          data-testid="create-nft-input-description"
          type="textarea"
          has-counter
          maxlength="1000"
          height="10rem"
          :placeholder="$t('mint.nft.description.placeholder')" />
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div class="w-100">
          <p>{{ $t('mint.blockchain.message') }}</p>
          <NeoSelect
            v-model="selectChain"
            class="mt-3"
            data-testid="create-nft-dropdown-select"
            expanded
            required>
            <option
              v-for="menu in menus"
              :key="menu.value"
              :value="menu.value"
              :data-testid="`nft-chain-dropdown-option-${menu.value}`">
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <!-- select collections -->
      <NeoField
        :key="`collection-${currentChain}`"
        ref="chooseCollectionRef"
        :label="`${$t('mint.nft.collection.label')} *`"
        @click="startSelectedCollection = true">
        <div class="w-100">
          <div
            v-if="showCollectiveOption"
            class="collection__option border-bottom border-k-grey py-3">
            <div
              class="is-flex"
              :class="{
                'collection__option--set': useCollectiveCollection,
                'collection__option--disabled': usePersonalCollection,
              }">
              <img
                :src="placeholder"
                class="collection__option__icon collection__option__icon--colored is-block no-border-radius"
                alt="asd" />
              <div>
                <p>{{ $t('mint.nft.collection.collective.label') }}</p>
                <p class="is-size-7">
                  {{ $t('mint.nft.collection.collective.message') }}
                </p>
              </div>
              <NeoSwitch
                v-model="useCollectiveCollection"
                :disabled="selectedCollection"
                data-testid="select-collective-collection"
                class="collection__option__action" />
            </div>
            <p v-if="useCollectiveCollection" class="w-100 pt-3">
              {{ $t('mint.nft.collection.message') }}
            </p>
          </div>
          <div class="collection__option border-bottom border-k-grey py-3">
            <div class="is-flex">
              <img
                :src="placeholder"
                class="collection__option__icon is-block no-border-radius"
                alt="asd" />
              <div>
                <p>{{ $t('mint.nft.collection.personal.label') }}</p>
                <p class="is-size-7">
                  {{ $t('mint.nft.collection.personal.message') }}
                </p>
              </div>
              <NeoButton
                rounded
                no-shadow
                :disabled="useCollectiveCollection"
                class="mt-3 collection__option__action"
                data-testid="trigger-collection-dropdown"
                :label="
                  usePersonalCollection
                    ? $t('mint.nft.collection.personal.cancel')
                    : $t('mint.nft.collection.personal.select')
                "
                @click="usePersonalCollection = !usePersonalCollection" />
            </div>
            <ChooseCollectionDropdown
              v-if="usePersonalCollection"
              full-width
              no-shadow
              class="mt-3 is-size-12"
              @selected-collection="onCollectionSelected" />
          </div>
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
        <NeoSwitch v-model="form.sale" data-testid="create-nft-sale-switch" />
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
              data-testid="create-nft-input-list-value"
              type="number"
              step="0.01"
              min="0.01"
              pattern="[0-9]+([\.,][0-9]+)?"
              placeholder="0.01 is the minimum"
              expanded />
            <div class="form-addons">
              {{ isBasilisk ? 'KSM' : chainSymbol }}
            </div>
          </div>
        </div>
      </NeoField>

      <!-- no of copies -->
      <NeoField :label="`${$t('mint.nft.copies.label')} (optional)`">
        <div class="w-100">
          <p>{{ $t('mint.nft.copies.message') }}</p>
          <NeoInput
            v-model="form.copies"
            data-testid="create-nft-input-copies"
            class="mt-3"
            type="number"
            placeholder="e.g 10"
            min="1"
            expanded />
          <BasicSwitch
            v-if="form.copies > 1"
            v-model="form.postfix"
            data-testid="create-nft-input-copies-switch"
            class="mt-3"
            label="mint.expert.postfix" />
        </div>
      </NeoField>

      <!-- nft properties -->
      <NeoField :label="`${$t('tabs.properties')} (optional)`">
        <CustomAttributeInput
          v-model="form.tags"
          :max="10"
          data-testid="create-nft-properties" />
      </NeoField>

      <!-- royalty -->
      <NeoField v-if="!isRmrk">
        <RoyaltyForm
          v-model:amount="form.royalty.amount"
          v-model:address="form.royalty.address"
          data-testid="create-nft-royalty" />
      </NeoField>

      <!-- explicit content -->
      <NeoField :label="`${$t('mint.nfsw')}`">
        <div class="w-full">
          <p>{{ $t('mint.nfswMessage') }}</p>
        </div>
        <NeoSwitch v-model="form.nsfw" data-testid="create-nft-nsfw-switch" />
      </NeoField>

      <hr class="my-6" />

      <!-- deposit and balance -->
      <div>
        <div class="is-flex has-text-weight-medium has-text-info">
          <div>{{ $t('mint.deposit') }}:&nbsp;</div>
          <div data-testid="create-nft-deposit-amount">
            {{ deposit }} {{ chainSymbol }}
          </div>
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
        data-testid="create-nft-button-new"
        class="is-size-6"
        native-type="submit"
        size="medium"
        :loading="isLoading" />
      <div class="p-4 is-flex">
        <NeoIcon icon="circle-info" size="medium" class="mr-4" />
        <p class="is-size-7">
          <span
            v-dompurify-html="
              $t('mint.requiredDeposit', [`${deposit} ${chainSymbol}`, 'NFT'])
            " />
          <a
            href="https://hello.kodadot.xyz/multi-chain/fees"
            target="_blank"
            class="has-text-link"
            data-testid="create-nft-learn-more-link"
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
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const { placeholder } = useTheme()

// composables
const { $consola } = useNuxtApp()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { transaction, status, isLoading, blockNumber, isError } =
  useTransaction()
const router = useRouter()
const { decimals } = useChain()

console.log(urlPrefix)

// form state
const form = reactive({
  file: null,
  name: '',
  description: '',
  collections: null,
  sale: false,
  salePrice: 0,
  copies: 1,
  postfix: false,
  nsfw: false,
  tags: [],
  royalty: {
    amount: 0,
    address: accountId.value,
  },
})

const showCollectiveOption = computed(
  () => urlPrefix.value === 'ahk' || urlPrefix.value === 'ahp',
)

// select collections
const useCollectiveCollection = ref(false)
const usePersonalCollection = ref(false)
const selectedCollection = ref()
const startSelectedCollection = ref<boolean>(false)
const chooseCollectionRef = ref()

watch(useCollectiveCollection, (val) => {
  if (val) {
    usePersonalCollection.value = false
  }
})

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

const deposit = computed(() =>
  (Number(totalItemDeposit.value) * form.copies).toFixed(4),
)

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

const confirm = async ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  toggleConfirm()

  autoTeleport.value = autoteleport

  if (!autoteleport) {
    await createNft()
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
const {
  transaction: listTransaction,
  isLoading: listIsLoading,
  isError: listIsError,
  status: listStatus,
  blockNumber: listBlockNumber,
} = useTransaction()

const autoTeleportActions = computed<AutoTeleportAction[]>(() => {
  const actions = [
    {
      action: mintAction.value,
      handler: createNft,
      prefix: currentChain.value,
      details: {
        isLoading: isLoading.value,
        isError: isError.value,
        status: status.value,
        blockNumber: blockNumber.value,
      },
    },
  ]

  if (needsListing.value) {
    actions.push({
      action: listAction.value,
      handler: (params: { isRetry: boolean }) => {
        if (params.isRetry) {
          return listNft()
        }
        return Promise.resolve()
      },
      prefix: currentChain.value,
      details: {
        isLoading: listIsLoading.value,
        isError: listIsError.value,
        status: listStatus.value,
        blockNumber: listBlockNumber.value,
      },
    })
  }

  return actions
})

// currently, on rmrk we need to list price manually
const listNft = async () => {
  try {
    await listTransaction(listAction.value, currentChain.value)

    transactionStatus.value = 'checkListed'
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    $consola.error(error)
  }
}

watchEffect(async () => {
  if (
    blockNumber.value &&
    createdItems.value &&
    transactionStatus.value === 'list'
  ) {
    await listNft()
  }
})

watchEffect(() => {
  const listStatusFinalized = listStatus.value === 'loader.finalized'
  const mintStatusFinalized = status.value === 'loader.finalized'

  // prepare nft blockNumber for redirect to detail page
  if (
    (transactionStatus.value === 'mint' ||
      transactionStatus.value === 'list') &&
    mintStatusFinalized &&
    blockNumber.value
  ) {
    mintedBlockNumber.value = blockNumber.value
    if (!needsListing.value) {
      transactionStatus.value = 'done'
    }
  }

  // if listing price is done, then redirect to detail page
  if (transactionStatus.value === 'checkListed' && listStatusFinalized) {
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

<template>
  <div class="is-centered columns">
    <Loader v-model="isLoading" :status="status" />
    <form class="is-half column" @submit.prevent="createNft">
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
        :label="`${$t('mint.nft.collection.label')} *`">
        <div class="w-100">
          <p>{{ $t('mint.nft.collection.message') }}</p>
          <ChooseCollectionDropdown
            full-width
            no-shadow
            class="mt-3"
            @selectedCollection="onCollectionSelected" />
        </div>
      </NeoField>

      <!-- list for sale -->
      <NeoField
        :key="currentChain"
        :label="$t('mint.nft.sale.label')"
        required
        class="sale"
        :class="{ 'sale-on': form.sale }">
        <div class="w-full">
          <p>{{ $t('mint.nft.sale.message') }}</p>
        </div>
        <NeoSwitch v-model="form.sale" :rounded="false" />
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
              placeholder="1 is the minimum"
              expanded />
            <div class="form-addons">
              {{ isBasilisk ? 'KSM' : chainSymbol }}
            </div>
          </div>
        </div>
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div>
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
        <div>
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
      <NeoField v-if="isBasilisk">
        <RoyaltyForm
          :amount="form.royalty.amount"
          :address="form.royalty.address" />
      </NeoField>

      <!-- explicit content -->
      <NeoField :label="`${$t('mint.nfsw')}`">
        <div class="w-full">
          <p>{{ $t('mint.nfswMessage') }}</p>
        </div>
        <NeoSwitch v-model="form.nsfw" :rounded="false" />
      </NeoField>

      <!-- deposit and balance -->
      <div>
        <hr class="my-6" />
        <NeoField>
          <div class="monospace">
            <p class="has-text-weight-medium is-size-6 has-text-info">
              <span>{{ $t('mint.deposit') }}:</span>
              <span>{{ totalItemDeposit }} {{ chainSymbol }}</span>
            </p>
            <p>
              <span>{{ $t('general.balance') }}: </span>
              <span>{{ balance }} {{ chainSymbol }}</span>
            </p>
            <nuxt-link v-if="isBasilisk" :to="`/${currentChain}/assets`">
              {{ $t('general.tx.feesPaidIn', [chainSymbol]) }}
            </nuxt-link>
          </div>
        </NeoField>

        <hr class="my-6" />
      </div>

      <!-- create nft button -->
      <NeoField>
        <div>
          <NeoButton
            expanded
            :label="submitButtonLabel"
            native-type="submit"
            size="medium"
            class="is-size-6"
            :loading="isLoading"
            :disabled="!canDeposit" />

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
        </div>
      </NeoField>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import type { Ref } from 'vue'
import type { TokenToList } from '@/composables/transaction/types'
import ChooseCollectionDropdown from '@/components/common/ChooseCollectionDropdown.vue'
import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSelect,
  NeoSwitch,
} from '@kodadot1/brick'
import DropUpload from '@/components/shared/DropUpload.vue'
import Loader from '@/components/shared/Loader.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'
import RoyaltyForm from '@/components/bsx/Create/RoyaltyForm.vue'
import CreateNftPreview from './CreateNftPreview.vue'
import resolveQueryPath from '@/utils/queryPathResolver'
import { availablePrefixes } from '@/utils/chain'
import { notificationTypes, showNotification } from '@/utils/notification'
import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import { balanceFrom } from '@/utils/balance'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { delay } from '@/utils/fetch'
import { toNFTId } from '@/components/rmrk/service/scheme'

// composables
const { $consola } = useNuxtApp()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { transaction, status, isLoading, blockNumber } = useTransaction()
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
const { isLogIn } = useAuth()
const { $i18n } = useNuxtApp()
// select collections
const selectedCollection = ref()

const depositLabel = computed(() =>
  canDeposit.value
    ? $i18n.t('mint.nft.create')
    : $i18n.t('confirmPurchase.notEnoughFuns')
)
const submitButtonLabel = computed(() => {
  return !isLogIn.value ? $i18n.t('mint.nft.connect') : depositLabel.value
})

const onCollectionSelected = (collection) => {
  selectedCollection.value = collection
}

const imagePreview = computed(() => {
  if (form.file) {
    return URL?.createObjectURL(form.file)
  }
})

// select available blockchain
const menus = availablePrefixes().filter(
  (menu) => menu.value !== 'movr' && menu.value !== 'glmr'
)
const chainByPrefix = computed(() =>
  menus.find((menu) => menu.value === urlPrefix.value)
)
const selectChain = ref(chainByPrefix.value || menus[0].value)

// get/set current chain/prefix
const currentChain = computed(() => selectChain.value as Prefix)
const { isBasilisk, isRemark } = useIsChain(currentChain)
watch(currentChain, () => {
  // reset some state on chain change
  form.salePrice = 0
  form.royalty.amount = 0

  setUrlPrefix(currentChain.value as Prefix)
})

// deposit stuff
const { balance, totalItemDeposit, chainSymbol } = useDeposit(currentChain)
const canDeposit = computed(() => {
  return (
    isLogIn.value &&
    parseFloat(balance.value) >= parseFloat(totalItemDeposit.value)
  )
})

// create nft
const transactionStatus = ref<
  'list' | 'checkListed' | 'mint' | 'done' | 'idle'
>('idle')
const createdNFTs = ref()
const mintedBlockNumber = ref()

const createNft = async () => {
  try {
    const { createdNFTs: minted } = (await transaction(
      {
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
      },
      currentChain.value
    )) as unknown as {
      createdNFTs: Ref<CreatedNFT[]>
    }

    if (isRemark.value && form.sale && form.salePrice) {
      createdNFTs.value = minted.value
      transactionStatus.value = 'list'
    } else {
      transactionStatus.value = 'mint'
    }
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    $consola.error(error)
  }
}

// currently, on rmrk we need to list price manually
watchEffect(async () => {
  if (
    blockNumber.value &&
    createdNFTs.value &&
    transactionStatus.value === 'list'
  ) {
    try {
      const list: TokenToList[] = createdNFTs.value.map((nft) => ({
        price: balanceFrom(form.salePrice, decimals.value),
        nftId: toNFTId(nft, String(blockNumber.value)),
      }))

      await transaction(
        {
          interaction: Interaction.LIST,
          urlPrefix: currentChain.value,
          token: list,
          successMessage: `[💰] Listed ${form.name} for ${form.salePrice} ${chainSymbol.value}`,
        },
        currentChain.value
      )

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
      DETAIL_TIMEOUT
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

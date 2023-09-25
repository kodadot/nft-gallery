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
      <NeoField :label="`${$t('mint.nft.art.label')} *`">
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
        :key="currentChain"
        :label="`${$t('mint.nft.collection.label')} *`">
        <div>
          <p>{{ $t('mint.nft.collection.message') }}</p>
          <NeoSelect v-model="form.collections" class="mt-3" expanded required>
            <option
              v-for="collection in listOfCollection"
              :key="collection.id"
              :value="collection.id">
              {{ collection.name || collection.id }} - ({{
                collection.totalCount
              }})
            </option>
          </NeoSelect>
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
        <RoyaltyForm v-bind.sync="form.royalty" />
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
            :label="`${
              canDeposit
                ? $t('mint.nft.create')
                : $t('confirmPurchase.notEnoughFuns')
            }`"
            type="submit"
            size="medium"
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
import resolveQueryPath from '@/utils/queryPathResolver'
import { availablePrefixes } from '@/utils/chain'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Interaction } from '@kodadot1/minimark/v1'
import { balanceFrom } from '@/utils/balance'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { delay } from '@/utils/fetch'

// composables
const { $apollo, $consola } = useNuxtApp()
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
const selectChain = ref(chainByPrefix.value?.value || menus[0].value)

// get/set current chain/prefix
const currentChain = computed(() => selectChain.value as Prefix)
const { isBasilisk } = useIsChain(currentChain)
watch(currentChain, () => {
  // reset some state on chain change
  form.salePrice = 0
  form.royalty.amount = 0

  setUrlPrefix(currentChain.value as Prefix)
})

// deposit stuff
const { balance, totalItemDeposit, chainSymbol } = useDeposit(currentChain)
const canDeposit = computed(() => {
  return parseFloat(balance.value) >= parseFloat(totalItemDeposit.value)
})

// select collections
const listOfCollection = ref()
const selectedCollection = computed(() => {
  return listOfCollection.value?.find(
    (collection) => collection.id === form.collections
  )
})

watchEffect(async () => {
  if (!accountId.value) {
    listOfCollection.value = []
    return
  }

  const queryPath = {
    ksm: 'chain-rmrk',
    rmrk: 'chain-rmrk',
  }
  const prefix = queryPath[currentChain.value] || currentChain.value
  const query = await resolveQueryPath(prefix, 'collectionForMint')
  const collections = await $apollo.query({
    query: query.default,
    client: currentChain.value,
    variables: {
      account: accountId.value,
    },
    fetchPolicy: 'network-only',
  })

  // https://github.com/kodadot/nft-gallery/issues/7298
  listOfCollection.value = collections?.data?.collectionEntities
    .map((ce) => ({
      ...ce,
      alreadyMinted: ce.nfts?.length,
      lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
      totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
    }))
    .filter((ce) => (ce.max || Infinity) - ce.alreadyMinted > 0)
})

// create nft
const createNft = async () => {
  try {
    await transaction(
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
    )
  } catch (error) {
    showNotification(`[ERR] ${error}`, notificationTypes.warn)
    $consola.error(error)
  }
}

// navigate to gallery detail page after success create nft
const retry = ref(10) // max retry 10 times

async function getNftId() {
  const query = await resolveQueryPath(currentChain.value, 'nftByBlockNumber')
  const { data } = await $apollo.query({
    query: query.default,
    client: currentChain.value,
    variables: {
      limit: 1,
      blockNumber: blockNumber.value,
    },
    fetchPolicy: 'network-only',
  })

  return data?.nftEntities?.[0]?.id
}

watchEffect(async () => {
  if (blockNumber.value && retry.value) {
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

<style lang="scss" scoped src="@/styles/pages/create.scss"></style>

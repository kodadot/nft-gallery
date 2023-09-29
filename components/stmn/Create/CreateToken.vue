<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm
      v-model="base"
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

<script lang="ts" setup>
import { Interaction } from '@kodadot1/minimark/v1'
import { showNotification, warningMessage } from '@/utils/notification'
import { NeoField } from '@kodadot1/brick'
import { unwrapSafe } from '@/utils/uniquery'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import { Max } from '@/composables/transaction/types'
import { Attribute } from '@kodadot1/minimark/common'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'
import CollapseWrapper from '@/components/shared/collapse/CollapseWrapper.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'

const { isLoading, status } = useLoader()
const { $i18n } = useNuxtApp()
const router = useRouter()
const { urlPrefix } = usePrefix()
const { balance, isLogIn, accountId } = useAuth()

withDefaults(
  defineProps<{
    showExplainerText?: boolean
  }>(),
  {
    showExplainerText: false,
  }
)

const base = ref<BaseTokenType>({
  name: '',
  file: null,
  description: '',
  selectedCollection: null,
  copies: 1,
  secondFile: null,
})

const collections = ref<(BaseMintedCollection & Max)[]>([])
const tags = ref<Attribute[]>([])
const price = ref(0)
const nsfw = ref(false)
const listed = ref(true)
const postfix = ref(true)
const balanceNotEnough = ref(false)

//TODO: implement royalty in mintTokenStatemine

// const hasRoyalty = ref(true)
// const royalty = ref({ amount: 0.15, address: '' })

const balanceInput = ref()
const baseTokenForm = ref()

const updatePrice = (value) => {
  price.value = value
}

const balanceNotEnoughMessage = computed(() => {
  return balanceNotEnough.value ? $i18n.t('tooltip.notEnoughBalance') : ''
})

const { data: collectionsData, refetch: refetchCollections } = useGraphql({
  queryName: 'collectionForMint',
  variables: { account: accountId.value },
})

watch(collectionsData, (newData) => {
  if (newData) {
    collections.value = unwrapSafe(newData.collectionEntities)
      ?.map((ce) => ({
        ...ce,
        alreadyMinted: ce.nfts?.length,
        lastIndexUsed: Math.max(...ce.nfts.map((nft) => nft.index)),
        totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
      }))
      .filter((ce) => (ce.max || Infinity) - ce.alreadyMinted > 0)
  }
})

watch(accountId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    refetchCollections({ account: newValue })
  }
})

const checkValidity = () => {
  const balanceInputValid = !listed.value || balanceInput.value.checkValidity()
  const baseTokenFormValid = baseTokenForm.value.checkValidity()
  const validCopies = base.value.copies > 0
  return balanceInputValid && baseTokenFormValid && validCopies
}

const submit = () => {
  if (!base.value.selectedCollection) {
    throw ReferenceError('[MINT] Unable to mint without collection')
  }
  if (!base.value.selectedCollection || !checkValidity()) {
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
    status: transStatus,
    isLoading: transLoading,
    blockNumber,
  } = useTransaction()

  watch([transLoading, transStatus], () => {
    isLoading.value = transLoading.value
    status.value = transStatus.value
  })

  watch(blockNumber, (block) => {
    if (block) {
      navigateToDetail()
    }
  })

  try {
    transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: {
        ...base.value,
        copies: Number(base.value.copies),
        tags: tags.value,
        nsfw: nsfw.value,
        postfix: postfix.value,
        price: price.value.toString(),
        // royalty: royalty.value,
        // hasRoyalty: hasRoyalty.value,
      },
    })
  } catch (e) {
    warningMessage(e)
  }
}

const navigateToDetail = () => {
  showNotification(
    `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
  )

  const selectedCollection = base.value
    .selectedCollection as BaseMintedCollection

  const nftIndex = Math.max(selectedCollection.lastIndexUsed, 0) + 1
  const nftId = `${selectedCollection.id}-${nftIndex}`
  const go = () => {
    router.push({
      path: `/${urlPrefix.value}/gallery/${nftId}`,
      query: { congratsNft: base.value.name },
    })
  }
  setTimeout(go, DETAIL_TIMEOUT)
}
</script>

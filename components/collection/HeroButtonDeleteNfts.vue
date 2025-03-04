<template>
  <SigningModal
    :title="$t('moreActions.deletingNfts')"
    :is-loading="isLoading"
    :status="status"
    @try-again="deleteNfts"
  />

  <NeoDropdownItem @click="deleteNfts()">
    {{ $i18n.t('moreActions.deleteNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@/utils/shoppingActions'
import nftIdListByCollection from '@/queries/subsquid/general/nftIdListByCollection'

type NftIds = {
  nfts?: {
    id: string
  }[]
}

const route = useRoute()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const {
  transaction,
  status,
  isLoading: isTransactionLoading,
  blockNumber,
} = useTransaction()

const id = route.params.id.toString()
const isLoading = ref(false)
const unsubscribeSubscription = ref(() => {})

const data = ref<NftIds>()
const { $apolloClient } = useNuxtApp()
$apolloClient.query({
  query: nftIdListByCollection,
  variables: {
    id: id,
    search: [{ currentOwner_eq: accountId.value }],
  },
}).then(res => data.value = res.data)

const deleteNfts = async () => {
  const nfts = data.value?.nfts
  const ids = nfts?.map(nft => nft.id)

  if (ids?.length) {
    isLoading.value = true

    await transaction({
      interaction: Interaction.CONSUME,
      nftIds: ids,
      urlPrefix: urlPrefix.value,
    })

    unsubscribeSubscription.value()
    unsubscribeSubscription.value = useSubscriptionGraphql({
      query: `
      nftEntities(where: {collection: {id_eq: "${id}"}, burned_eq: false}) {
        id
        name
      }
    `,
      onChange: ({ data }) => {
        if (
          data.nftEntities.length === 0
          || status.value === TransactionStatus.Finalized
        ) {
          isLoading.value = false
        }
      },
    })
  }
}

watch([isTransactionLoading, blockNumber], ([loading, block]) => {
  if (!loading && !block) {
    isLoading.value = false
  }
})
</script>

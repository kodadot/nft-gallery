<template>
  <SigningModal
    v-model="isLoading"
    :status="status"
    :title="$t('moreActions.deletingNfts')" />

  <NeoDropdownItem @click="deleteNfts()">
    {{ $i18n.t('moreActions.deleteNfts') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NFTs } from '@/composables/transaction/types'
import { NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()
const { $i18n } = useNuxtApp()
const { transaction, status } = useTransaction()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const isLoading = ref(false)
const id = route.params.id.toString()

type NftIds = {
  nfts?: {
    id: string
  }[]
}

const { data } = useGraphql({
  queryName: 'nftIdListByCollection',
  variables: {
    id: id,
    search: [{ currentOwner_eq: accountId.value }],
  },
})

const deleteNfts = async () => {
  isLoading.value = true
  const nfts = (data.value as NftIds).nfts
  const ids = nfts?.map((nft) => nft.id)

  if (ids?.length) {
    await transaction({
      interaction: NFTs.BURN_MULTIPLE,
      nftIds: ids,
      urlPrefix: urlPrefix.value,
    })

    useSubscriptionGraphql({
      query: `
      nftEntities(where: {collection: {id_eq: "${id}"}, burned_eq: false}) {
        id
        name
      }
    `,
      onChange: ({ data }) => {
        if (
          data.nftEntities.length === 0 ||
          status.value === TransactionStatus.Finalized
        ) {
          isLoading.value = false
        }
      },
    })
  }
}
</script>

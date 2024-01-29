<template>
  <SigningModal
    :title="$t('confirmDeleteCollection.deletingCollection')"
    :is-loading="isLoading"
    :status="status"
    @try-again="deleteCollection" />

  <NeoDropdownItem @click="confirmDeleteModalActive = true">
    {{ $i18n.t('moreActions.deleteCollection') }}
  </NeoDropdownItem>

  <ConfirmDeleteCollectionModal
    v-model="confirmDeleteModalActive"
    @delete="closeAndDelete" />
</template>

<script setup lang="ts">
import { Collections } from '@/composables/transaction/types'
import { NeoDropdownItem } from '@kodadot1/brick'
import ConfirmDeleteCollectionModal from './ConfirmDeleteCollectionModal.vue'

const route = useRoute()
const { $i18n } = useNuxtApp()
const {
  transaction,
  status,
  blockNumber,
  isLoading: isTransactionLoading,
} = useTransaction()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const confirmDeleteModalActive = ref(false)
const isLoading = ref(false)
const unsubscribeSubscription = ref(() => {})

const deleteCollection = async () => {
  isLoading.value = true
  const id = route.params.id.toString()

  await transaction({
    interaction: Collections.DELETE,
    urlPrefix: urlPrefix.value,
    collectionId: id,
  })

  unsubscribeSubscription.value()
  unsubscribeSubscription.value = useSubscriptionGraphql({
    query: `
      collectionEntity: collectionEntityById(id: "${id}") {
        id
        burned
      }
    `,
    onChange: ({ data }) => {
      if (data.collectionEntity.burned) {
        isLoading.value = false
        navigateTo(`/${urlPrefix.value}/u/${accountId.value}?tab=collections`)
      }
    },
    onError: () => {
      isLoading.value = false
    },
  })
}

const closeAndDelete = () => {
  confirmDeleteModalActive.value = false
  deleteCollection()
}

watch([isTransactionLoading, blockNumber], ([loading, block]) => {
  if (!loading && !block) {
    isLoading.value = false
  }
})
</script>

<template>
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
const { $i18n, $updateLoader } = useNuxtApp()
const { transaction } = useTransaction()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const confirmDeleteModalActive = ref(false)

const deleteCollection = async () => {
  $updateLoader(true)
  const id = route.params.id.toString()

  await transaction({
    interaction: Collections.DELETE,
    urlPrefix: urlPrefix.value,
    collectionId: id,
  })

  useSubscriptionGraphql({
    query: `
      collectionEntity: collectionEntityById(id: "${id}") {
        id
        burned
      }
    `,
    onChange: ({ data }) => {
      if (data.collectionEntity.burned) {
        $updateLoader(false)
        navigateTo(`/${urlPrefix.value}/u/${accountId.value}?tab=collections`)
      }
    },
  })
}

const closeAndDelete = () => {
  confirmDeleteModalActive.value = false
  deleteCollection()
}
</script>

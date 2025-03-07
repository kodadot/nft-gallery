<template>
  <NeoDropdownItem @click="confirmDeleteModalActive = true">
    {{ $i18n.t('moreActions.deleteCollection') }}
  </NeoDropdownItem>

  <ConfirmDeleteCollectionModal
    v-model="confirmDeleteModalActive"
    :get-action="getAction"
    :collection="collection"
    @success="collectionDeleted"
  />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import ConfirmDeleteCollectionModal from './ConfirmDeleteCollectionModal.vue'
import { Collections } from '@/composables/transaction/types'
import type { Actions } from '@/composables/transaction/types'

defineProps<{
  collection: unknown
}>()

const route = useRoute()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const confirmDeleteModalActive = ref(false)
const unsubscribeSubscription = ref(() => {})

const collectionId = computed(() => route.params.id.toString())

const getAction = (): Actions => {
  return {
    interaction: Collections.DELETE,
    urlPrefix: urlPrefix.value,
    collectionId: collectionId.value,
  }
}

const collectionDeleted = async () => {
  unsubscribeSubscription.value()
  unsubscribeSubscription.value = useSubscriptionGraphql({
    query: `
      collectionEntity: collectionEntityById(id: "${collectionId.value}") {
        id
        burned
      }
    `,
    onChange: ({ data }) => {
      if (data.collectionEntity.burned) {
        navigateTo(`/${urlPrefix.value}/u/${accountId.value}?tab=collections`)
      }
    },
  })
}
</script>

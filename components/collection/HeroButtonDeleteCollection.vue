<template>
  <NeoDropdownItem @click="deleteCollection()">
    {{ $i18n.t('moreActions.deleteCollection') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { Collections } from '@/composables/transaction/types'
import { NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()
const { $i18n, $updateLoader } = useNuxtApp()
const { transaction } = useTransaction()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const deleteCollection = async () => {
  $updateLoader(true)
  const id = route.params.id.toString()

  await transaction({
    interaction: Collections.DELETE,
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
</script>

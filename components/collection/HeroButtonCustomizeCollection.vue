<template>
  <NeoDropdownItem @click="customizeCollectionModalActive = true">
    {{ $i18n.t('moreActions.customize') }}
  </NeoDropdownItem>

  <CollectionCustomizeModal
    v-model="customizeCollectionModalActive"
    :min="min"
    @customize="closeAndCustomize" />
</template>

<script setup lang="ts">
import { Collections } from '@/composables/transaction/types'
import { NeoDropdownItem } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    min: number
  }>(),
  {
    min: undefined,
  },
)

const route = useRoute()
const { $i18n, $updateLoader } = useNuxtApp()
const { transaction } = useTransaction()
const { urlPrefix } = usePrefix()
// const { accountId } = useAuth()

const customizeCollectionModalActive = ref(false)

const customizeCollection = async () => {
  $updateLoader(true)
  const id = route.params.id.toString()

  await transaction({
    interaction: Collections.SET_MAX_SUPPLY,
    urlPrefix: urlPrefix.value,
    collectionId: id,
  })
}

const closeAndCustomize = () => {
  customizeCollectionModalActive.value = false
  customizeCollection()
}
</script>

<template>
  <ActionModal
    :is-modal-active="isOpen"
    :get-action="getAction"
    :label="label"
    :disabled="!acknowledged"
    :title="$t('moreActions.deleteCollection')"
    :signing-title="$t('confirmDeleteCollection.deletingCollection')"
    @close="isOpen = false"
    @success="$emit('success')"
  >
    <template #body>
      <BaseCartItemDetails
        class="mt-4!"
        :name="collection.name"
        :second-name="$t('collection')"
        :image="sanitizeIpfsUrl(collection.meta.image)"
      />

      <hr class="mt-4! mb-5!">
    </template>

    <template #action-button-top>
      <div class="mb-4">
        <NeoCheckbox
          v-model="acknowledged"
          class="flex! items-center"
          label-class="pl-3! text-sm capitalize"
          :label="$t('confirmDeleteCollection.content')"
        />
      </div>
    </template>
  </ActionModal>
</template>

<script setup lang="ts">
import { NeoCheckbox } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import type { Actions } from '@/composables/transaction/types'

defineEmits(['success'])
defineProps<{
  getAction: () => Actions
  collection: any
}>()

const isOpen = defineModel<boolean>({ required: true })

const { $i18n } = useNuxtApp()
const acknowledged = ref(false)

const label = computed(() => {
  if (!acknowledged.value) {
    return $i18n.t('helper.acknowledgeToContinue')
  }
  return $i18n.t('moreActions.deleteCollection')
})

useModalIsOpenTracker({
  isOpen: isOpen,
  onChange: () => {
    acknowledged.value = false
  },
})
</script>

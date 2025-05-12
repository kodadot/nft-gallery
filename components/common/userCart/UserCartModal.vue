<template>
  <ActionModal
    :is-modal-active="isModalActive"
    :get-action="getAction"
    :label="label"
    :disabled="disabled"
    :title="title"
    :signing-title="signingTitle"
    :show-transaction-notification="showTransactionNotification"
    :action-disabled="actionDisabled"
    :loading="loading"
    :abi="abi"
    @open="onOpen"
    @close="onClose"
  >
    <template #body>
      <div>
        <UserCartSingleItem
          v-if="items.length === 1"
          class="mt-4!"
          :item="nft"
        />
        <UserCartMultipleItems
          v-else
          class="mt-8!"
          :items="items"
        />
      </div>

      <slot name="body" />
    </template>

    <template #action-button-top>
      <slot name="action-button-top" />
    </template>

    <template #footer>
      <slot name="footer" />
    </template>
  </ActionModal>
</template>

<script setup lang="ts">
import type { Actions, Abi } from '@/composables/transaction/types'

export type UserCartModalExpose = {
  items: ListCartItem[]
  abi: Abi
}

const emit = defineEmits(['reset'])
const props = withDefaults(defineProps<{
  getAction: () => Actions
  mode: UserCartMode
  label: string
  disabled?: boolean
  loading?: boolean
  title: string
  signingTitle: string
  showTransactionNotification?: boolean
}>(), {
  showTransactionNotification: true,
})

const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()

const items = ref<ListCartItem[]>([])

const { urlPrefix } = usePrefix()
const { isEvm } = useIsChain(urlPrefix)

const isModalActive = computed(() => Boolean(preferencesStore.userCartModal?.open && preferencesStore.userCartModal?.mode === props.mode))
const nft = computed(() => items.value[0])
const abi = useCollectionAbi(computed(() => nft.value?.collection.id), { disabled: !isEvm.value })
const hasAbi = computed(() => isEvm.value ? Boolean(abi.value) : true)
const actionDisabled = computed(() => !hasAbi.value)

const loadingAbi = computed(() => (isEvm.value ? !abi.value : false))
const loading = computed(() => (props.loading || loadingAbi.value))

const onClose = () => {
  preferencesStore.setClosedUserCartModal()
  onModalAnimation(() => {
    listingCartStore.clearListedItems()
    preferencesStore.userCartModal = undefined
    emit('reset')
  })
}

const onOpen = () => {
  items.value = [...listingCartStore.itemsInChain]
}

defineExpose({ items, abi })
</script>

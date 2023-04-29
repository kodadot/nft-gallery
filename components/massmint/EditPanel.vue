<template>
  <NeoSidebar
    fullheight
    right
    overlay
    class="sidebar-width"
    position="fixed"
    :open="open"
    :can-cancel="true"
    :on-cancel="closePanel">
    <div
      class="border-left theme-background-color navbar-margin p-5 is-flex is-flex-direction-column is-align-items-center is-justify-content-space-between h-full">
      <div
        class="is-flex w-full is-flex-direction-column is-justify-content-space-between is-align-items-center">
        <div class="is-flex w-full">
          <div class="is-flex is-justify-content-center is-flex-grow-1">
            {{ $t('massmint.edit') }} #{{ nft?.id }}
          </div>

          <NeoButton
            icon="close"
            size="medium"
            variant="icon"
            no-shadow
            @click.native="closePanel" />
        </div>
        <NeoAvatar
          :avatar="nft?.imageUrl"
          :name="nft?.name || `${nft?.id}`"
          :size="128"
          :placeholder="placeholder"
          class="my-5" />
        <form class="w-full">
          <NeoField
            :label="$t('massmint.name')"
            class="w-full mb-4 placholder-color"
            :error="!name">
            <NeoInput
              v-model="name"
              required
              :placeholder="'*' + $t('massmint.required')" />
          </NeoField>
          <NeoField :label="$t('massmint.description')" class="w-full mb-4">
            <NeoInput
              v-model="description"
              type="textarea"
              has-counter
              maxlength="500"
              height="10rem" />
          </NeoField>
          <NeoField :label="$t('massmint.price')" class="w-full">
            <div class="is-flex">
              <NeoInput
                v-model="price"
                type="number"
                step="any"
                class="is-flex is-flex-grow-2" />
              <div
                class="border-top border-right border-bottom px-5 is-flex is-flex-grow-1 is-justify-content-center is-align-items-center">
                KSM
              </div>
            </div>
          </NeoField>
        </form>
      </div>
      <NeoButton
        class="w-full"
        :label="$t('massmint.save')"
        variant="k-accent"
        :disabled="!name"
        @click.native="save" />
    </div>
  </NeoSidebar>
</template>

<script setup lang="ts">
import {
  NeoAvatar,
  NeoButton,
  NeoField,
  NeoInput,
  NeoSidebar,
} from '@kodadot1/brick'
import { NFT } from './types'
const { placeholder } = useTheme()

const props = defineProps<{
  nft?: NFT
  open: boolean
}>()

const internalNfT = ref<Partial<NFT>>({})
const name = computed({
  get: () => internalNfT.value.name || props.nft?.name || '',
  set: (value) => {
    internalNfT.value = {
      ...internalNfT.value,
      name: value,
    }
  },
})
const description = computed({
  get: () => internalNfT.value.description || props.nft?.description || '',
  set: (value) => {
    internalNfT.value = {
      ...internalNfT.value,
      description: value,
    }
  },
})
const price = computed({
  get: () => internalNfT.value.price || props.nft?.price || '',
  set: (value) => {
    internalNfT.value = {
      ...internalNfT.value,
      price: Number(value),
    }
  },
})

const emit = defineEmits(['close', 'save'])

const closePanel = () => {
  internalNfT.value = {}
  emit('close')
}

const save = () => {
  const nft = {
    ...props.nft,
    ...internalNfT.value,
  }
  emit('save', nft)
  closePanel()
}
</script>

<style lang="scss" scoped>
.navbar-margin {
  margin-top: 83px;
}

.cover {
  object-fit: cover;
}

.sidebar-width:deep .o-side__content {
  width: 30%;
}
</style>

<template>
  <NeoSidebar
    fullheight
    right
    class="w-500px"
    position="fixed"
    :open="open"
    :can-cancel="true"
    :on-cancel="onClose">
    <div
      class="border-left theme-background-color navbar-margin px-6 pb-7 pt-3 is-flex is-flex-direction-column is-align-items-center">
      <div class="is-flex w-full">
        <div class="is-flex is-justify-content-center is-flex-grow-1">
          Edit #{{ nft?.id }}
        </div>
        <NeoIcon
          icon="close"
          size="small"
          class="is-clickable"
          @click.native="onClose" />
      </div>
      <img :src="nft?.imageUrl" class="image is-128x128 border k-shadow my-5" />
      <div class="form w-full">
        <o-field label="Name" class="w-full mb-5">
          <o-input v-model="name" />
        </o-field>
        <o-field label="Description" class="w-full mb-5">
          <o-input v-model="description" type="textarea" />
        </o-field>
        <o-field label="Price" class="w-full">
          <div class="is-flex">
            <o-input v-model="price" class="is-flex is-flex-grow-2" />
            <div
              class="border is-flex is-flex-grow-1 py-3 is-justify-content-center">
              KSM
            </div>
          </div>
        </o-field>
      </div>
      <NeoButton
        class="mt-6 w-full"
        label="Save"
        variant="k-accent"
        @click.native="save" />
    </div>
  </NeoSidebar>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoSidebar } from '@kodadot1/brick'
import { NFT } from './types'
import { OField, OInput } from '@oruga-ui/oruga'
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

const onClose = () => {
  internalNfT.value = {}
  emit('close')
}

const save = () => {
  const nft = {
    ...props.nft,
    ...internalNfT.value,
  }
  emit('save', nft)
  onClose()
}
</script>

<style lang="scss" scoped>
.navbar-margin {
  margin-top: 83px;
}

.w-500px:deep .o-side__content {
  width: 35%;
}

.form:deep {
  .o-field__label {
    margin-bottom: 1rem;
  }

  .o-input__textarea {
    height: 10rem;
  }
}
</style>

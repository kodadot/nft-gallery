<template>
  <NeoSidebar
    fullheight
    right
    class="w-500px"
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
          <NeoIcon
            icon="close"
            size="small"
            class="is-clickable"
            @click.native="closePanel" />
        </div>
        <img :src="nft?.imageUrl" class="image is-half border k-shadow my-5" />
        <div class="form w-full">
          <o-field
            :label="$t('massmint.name')"
            class="w-full mb-5 placholder-color"
            :class="{ 'red-border': !name }">
            <o-input
              v-model="name"
              :placeholder="'*' + $t('massmint.required')"
              class="field-height" />
          </o-field>
          <o-field :label="$t('massmint.description')" class="w-full mb-5">
            <o-input v-model="description" type="textarea" />
          </o-field>
          <o-field :label="$t('massmint.price')" class="w-full">
            <div class="is-flex">
              <o-input
                v-model="price"
                class="is-flex is-flex-grow-2 field-height" />
              <div
                class="border is-flex is-flex-grow-1 field-height is-justify-content-center is-align-items-center">
                KSM
              </div>
            </div>
          </o-field>
        </div>
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
@import '@/styles/abstracts/variables';

.navbar-margin {
  margin-top: 83px;
}

.field-height {
  height: 2rem;

  :deep input {
    height: 100%;
  }
}

.image.is-half {
  width: 45%;
  height: auto;
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

  input {
    @include ktheme() {
      border: 1px solid theme('text-color');
    }
  }
}

.o-field--focused:deep {
  input,
  textarea {
    border-radius: 0;
    outline: none;
  }
}

.placholder-color:deep input::placeholder {
  @include ktheme() {
    color: theme('k-red');
  }
}

.red-border:deep input {
  @include ktheme() {
    border-color: theme('k-red');
  }
}
</style>

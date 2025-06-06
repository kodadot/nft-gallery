<template>
  <NeoSidebar
    fullheight
    right
    overlay
    class="sidebar-width"
    position="fixed"
    :open="open"
    :can-cancel="true"
    :on-cancel="closePanel"
  >
    <div
      class="border-l bg-background-color navbar-margin p-5 flex flex-col items-center justify-between h-full overflow-y-auto"
    >
      <div class="flex w-full flex-col justify-between items-center">
        <div class="flex w-full">
          <div class="flex justify-center grow">
            {{ $t('massmint.edit') }} #{{ nft?.id }}
          </div>

          <NeoButton
            icon="close"
            size="medium"
            variant="icon"
            no-shadow
            @click="closePanel"
          />
        </div>
        <NeoAvatar
          :image-component="NuxtImg"
          :avatar="nft?.imageUrl"
          :name="nft?.name || `${nft?.id}`"
          :size="128"
          :placeholder="placeholder"
          class="my-5 overflow-hidden"
        />
        <form class="w-full">
          <NeoField
            :label="$t('massmint.name')"
            class="w-full mb-4 placholder-color"
            :error="!name"
          >
            <NeoInput
              v-model="name"
              required
              :placeholder="'*' + $t('massmint.required')"
            />
          </NeoField>
          <NeoField
            :label="$t('massmint.description')"
            class="w-full mb-4"
          >
            <NeoInput
              v-model="description"
              type="textarea"
              has-counter
              maxlength="500"
              height="10rem"
            />
          </NeoField>
          <NeoField :label="`${$t('nft.properties.label')}`">
            <CustomAttributeInput
              v-model="attributes"
              :max="10"
              default-open
            />
          </NeoField>
          <NeoField
            :label="$t('massmint.price')"
            class="w-full"
          >
            <div class="relative w-full">
              <NeoInput
                v-model="price"
                input-class="pr-8"
                type="number"
                placeholder="0"
                step="any"
                min="0"
              />
              <div class="absolute right-2 top-3 text-k-grey">
                {{ unit }}
              </div>
            </div>
          </NeoField>
        </form>
      </div>
      <div class="pt-2 w-full">
        <NeoButton
          class="w-full"
          :label="$t('massmint.save')"
          variant="primary"
          :disabled="!name"
          @click="save"
        />
      </div>
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
import type { NFT } from './types'
import CustomAttributeInput from '@/components/create/CustomAttributeInput.vue'

const props = defineProps<{
  nft?: NFT
  open: boolean
}>()

const NuxtImg = resolveComponent('NuxtImg')

const { placeholder } = useTheme()
const { unit } = useChain()

const internalNfT = ref<Partial<NFT>>({})
const dirty = ref({ name: false, description: false, price: false, attributes: false })

const createField = (fieldName: string, defaultValue: string | unknown = '') =>
  computed({
    get: () =>
      dirty.value[fieldName]
        ? internalNfT.value[fieldName]
        : props.nft?.[fieldName] || defaultValue,
    set: (value) => {
      internalNfT.value = {
        ...internalNfT.value,
        [fieldName]:
          fieldName === 'price' && value !== '' ? Number(value) : value,
      }
      dirty.value[fieldName] = true
    },
  })

const name = createField('name')
const description = createField('description')
const price = createField('price')
const attributes = createField('attributes', [])

const emit = defineEmits(['close', 'save'])

const closePanel = () => {
  internalNfT.value = {}
  dirty.value = { name: false, description: false, price: false, attributes: false }
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
  margin-top: 80px;
}

.cover {
  object-fit: cover;
}

.sidebar-width:deep(.o-side__content) {
  width: 30%;
}
</style>

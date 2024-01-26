<template>
  <NeoStickyModal
    v-model="isModalActive"
    :is-mobile="isMobile"
    @close="onClose">
    <template #header>
      <span>
        {{ $t('identity.create') }}
      </span>
    </template>

    <template #body>
      <template v-for="(field, key, index) in identity">
        <div
          v-if="showField(key, field)"
          :key="key"
          class="flex justify-between items-center py-4"
          :class="{ 'border-t-k-shade': index !== 0 }">
          <span class="font-bold is-size-6 capitalize flex justify-center">
            <NeoIcon
              v-if="field.icon"
              class="mr-2"
              :icon="field.icon?.name"
              :pack="field.icon?.pack" />
            <span>{{ field.label }}</span>
          </span>
          <span class="flex items-center">
            <span class="ml-2 is-size-6">
              {{ field.value || '--' }}
            </span>
          </span>
        </div>
      </template>
    </template>

    <template #footer>
      <div class="flex justify-between items-center mb-3">
        <span class="font-bold is-size-6">{{ $t('identity.deposit') }}</span>
        <div class="flex items-center">
          <span class="text-k-grey mr-1 text-xs">({{ depositUsd }})</span>
          <span class="font-bold is-size-5"> {{ deposit }}</span>
        </div>
      </div>

      <NeoButton
        :label="$t('identity.create')"
        variant="k-accent"
        no-shadow
        class="flex flex-grow btn-height"
        @click="emit('confirm')" />
    </template>
  </NeoStickyModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoStickyModal } from '@kodadot1/brick'
import {
  IdentityField,
  IdentityForm,
} from '@/components/common/IdentityForm.vue'

const emit = defineEmits(['confirm', 'close'])

const props = defineProps<{
  modelValue: boolean
  deposit: string
  depositUsd: string
  identity: IdentityForm
  identityActiveSocials: Record<string, boolean>
  isMobile: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')

const showField = (key: string, field: IdentityField) =>
  field.isSocial ? props.identityActiveSocials[key] : true

const onClose = () => {
  emit('close')
}
</script>
<style lang="scss" scoped>
.btn-height {
  height: 3.5rem;
}
</style>

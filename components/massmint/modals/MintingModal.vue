<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="!loading"
    @close="emit('close')"
  >
    <div class="p-7">
      <div
        v-if="loading"
        class="flex flex-col items-center"
      >
        <img
          src="~/assets/svg/preloader.svg"
          width="200"
        >
        <span class="mt-6">{{ $t('massmint.mintingYourNFTs') }}</span>
      </div>
      <div
        v-else
        class="flex flex-col items-center"
      >
        <KIcon
          name="i-mdi:check-circle-outline"
          class="text-[2.5rem] text-k-green"
        />
        <span class="mt-4">{{ $t('massmint.mintDone') }}</span>
        <div class="flex w-full justify-center pt-6 px-7">
          <NeoButton
            :label="$t('massmint.done')"
            variant="primary"
            no-shadow
            class="flex grow h-[3.25rem]"
            @click="emit('close')"
          />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['close'])
</script>

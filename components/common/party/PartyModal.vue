<template>
  <transition name="slide">
    <div
      class="party shadow-primary h-fit fixed !top-20 md:!top-24 left-4 border-2 bg-background-color p-2 sm:p-6 flex justify-between gap-6 max-w-[498px]">
      <div
        class="flex-1 min-w-[91px] h-[116px] flex justify-center items-center">
        <img :src="'/drop/party.svg'" :alt="'cursors'" />
      </div>
      <div class="max-w-[335px] flex flex-col gap-3">
        <div class="flex justify-between font-bold">
          <p>{{ $i18n.t('partyModal.title') }}</p>
          <NeoIcon icon="close" size="large" @click="closeModal" />
        </div>
        <p class="text-sm w-5/6">
          {{ $i18n.t('partyModal.text') }}
          <a
            href="https://hello.kodadot.xyz/tutorial/generative-art/generative-drops/drop-party"
            class="text-k-blue"
            target="_blank"
            rel="nofollow noopener noreferrer"
            >{{ $i18n.t('helper.learnMore') }}
          </a>
        </p>

        <div class="flex justify-between items-center">
          <NeoButton variant="text" no-shadow @click="stopParty">
            <span class="text-k-grey">{{ $i18n.t('partyModal.no') }}</span>
          </NeoButton>
          <NeoButton variant="pill" no-shadow @click="closeModal">
            <span>{{ $i18n.t('partyModal.yes') }}</span>
          </NeoButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const emit = defineEmits(['close'])

const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()

const closeModal = () => {
  emit('close')
}
const stopParty = () => {
  preferencesStore.partyMode = false
  closeModal()
}

onMounted(() => {
  preferencesStore.firstTimePartyMode = false
})
</script>

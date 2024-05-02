<template>
  <transition name="fade">
    <div
      v-if="isPartyModalOpen"
      class="fixed top-20 md:top-24 left-4 z-[1000] w-[calc(100%-32px)] md:w-[31.25rem] h-fit shadow-primary bg-background-color !p-6 gap-6 flex border items-center">
      <div class="max-md:hidden relative h-full w-fit flex-shrink-0">
        <img
          src="/party-mode-experience.svg"
          alt="drop party cursors"
          class="h-[116px]" />
      </div>

      <div class="w-full flex flex-col gap-3">
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-2">
            <p class="font-bold">
              {{ $t('party.modal.title') }}
            </p>
            <p class="text-sm">
              {{ $t('party.modal.subtitle') }}

              <a
                href="https://hello.kodadot.xyz/tutorial/generative-art/generative-drops/drop-party"
                class="text-k-blue"
                target="_blank"
                rel="nofollow noopener noreferrer"
                >{{ $t('helper.learnMore') }}
              </a>
            </p>
          </div>
          <div>
            <NeoButton
              icon="close"
              variant="icon"
              size="large"
              no-shadow
              class="!h-fit"
              @click="isPartyModalOpen = false" />
          </div>
        </div>

        <div class="flex items-center justify-between flex-wrap">
          <NeoButton
            variant="text"
            no-shadow
            class="!text-k-grey"
            @click="partyMode = false">
            {{ $t('party.modal.decline') }}
          </NeoButton>
          <NeoButton
            variant="outlined-rounded"
            no-shadow
            @click="partyMode = true">
            {{ $t('party.modal.accept') }}
          </NeoButton>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const { partyMode, getHasUserNotSetPartyMode } = storeToRefs(
  usePreferencesStore(),
)

const isPartyModalOpen = ref(getHasUserNotSetPartyMode.value)

if (getHasUserNotSetPartyMode.value) {
  watch(getHasUserNotSetPartyMode, () => {
    isPartyModalOpen.value = getHasUserNotSetPartyMode.value
  })
}
</script>

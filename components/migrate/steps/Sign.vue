<template>
  <div>
    <div class="mt-5">{{ $t('migrate.signNotes') }}</div>
    <p class="mt-5 has-text-grey is-size-7">
      {{ $t('migrate.signStep.notesModal') }}
    </p>
    <hr />
    <p class="is-size-7">
      <strong><NeoIcon icon="lightbulb" /> {{ $t('tip') }}</strong
      >: {{ $t('migrate.signStep.notesPopup') }}
    </p>

    <p class="my-5">Follow Steps:</p>
    <div
      v-if="showStartSigning"
      class="mb-6 w-full rounded-full border border-toggle-active-switch px-4 py-[10px] text-center capitalize hover:cursor-pointer hover:bg-background-color-inverse hover:text-text-color-inverse">
      <div class="flex gap-4 w-full justify-center" @click="startSigning()">
        <p>Click here to start signing</p>
        <NeoIcon icon="chevrons-right" />
      </div>
    </div>

    <MigrateStepsSignLoader />

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 h-14 capitalize"
      expanded
      :disabled="steps !== 'init'"
      @click="signTransactions()" />
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { type Steps } from '@/composables/useMigrate'

const { setUrlPrefix } = usePrefix()
const route = useRoute()

const to = route.query.destination as Prefix
const collectionOwner = route.query.collectionOwner?.toString()

setUrlPrefix(to)

const steps = ref<Steps>('init')
provide('steps', {
  steps: readonly(steps),
  updateSteps: (step: Steps) => {
    steps.value = step
  },
})

const signTransactions = async () => {
  if (collectionOwner) {
    steps.value = 'step2'
  } else {
    steps.value = 'step1'
  }
}

const showStartSigning = ref(true)
const startSigning = async () => {
  await signTransactions()
  showStartSigning.value = false
}
</script>

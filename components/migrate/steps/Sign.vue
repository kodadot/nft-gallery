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

    <MigrateStepsSignLoader />

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 btn-submit"
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
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}
</style>

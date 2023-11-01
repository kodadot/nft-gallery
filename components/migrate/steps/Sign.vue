<template>
  <div>
    <div class="mt-5">{{ $t('migrate.signNotes') }}</div>
    <p class="mt-5 has-text-grey is-size-7">
      - Please do not exit this modal until transactions are complete -
    </p>
    <hr />
    <p class="is-size-7">
      <strong><NeoIcon icon="lightbulb" /> Tip</strong>: Look for popups from
      your wallet extension for signing.
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
import { type Steps } from '@/components/migrate/utils'

const { setUrlPrefix } = usePrefix()
const route = useRoute()

const to = route.query.destination as Prefix

setUrlPrefix(to)

const steps = ref<Steps>('init')
provide('steps', {
  steps: readonly(steps),
  updateSteps: (step: Steps) => {
    steps.value = step
  },
})

const signTransactions = async () => {
  steps.value = 'step1'
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}
</style>

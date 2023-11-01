<template>
  <div class="mb-5">
    <div class="is-flex is-align-items-center mb-4">
      <div class="mr-5"><NeoIcon v-bind="iconIdle" class="fa-2x" /></div>
      <div>
        <p class="has-text-weight-bold">Finalization</p>
        <p class="is-size-7 has-text-grey">
          Please authorize transactions to complete the NFT migration.
        </p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4">1/1 Left</div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4 is-flex">
        <!-- <NeoIcon icon="circle" class="mr-4" /> -->
        <div>
          <p>Finalizing {{ itemCount }} Items</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { type Steps, iconIdle } from '@/components/migrate/utils'

const route = useRoute()

const itemCount = route.query.itemCount?.toString()

const { steps } = inject('steps') as {
  steps: Ref<Steps>
  updateSteps: (step: Steps) => void
}

// TODO: function to burn items in previous chain

// go to congrats page
watchEffect(() => {
  if (steps.value === 'step3') {
    // navigateTo({
    //   path: '/migrate/congrats',
    //   query: {
    //     ...route.query,
    //   },
    // })
    console.log('move to congrats page')
  }
})
</script>

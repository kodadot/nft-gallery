<template>
  <div>
    <!-- step 1 phase -->
    <MigrateStepsSignLoader1 />

    <!-- step 2 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step2')" /></div>
        <div>
          <p class="has-text-weight-bold">Migrating your items</p>
          <p class="is-size-7 has-text-grey">
            You will now sign transactions to migrate NFTs you own.
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
            <p>Migrating {{ itemCount }} Items</p>
          </div>
        </div>
      </div>
    </div>

    <!-- step 3 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step3')" /></div>
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
  </div>
</template>

<script setup lang="ts">
import { type Steps } from '../utils'
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{
  steps: Steps
  itemCount?: string
}>()

const iconIdle = {
  icon: 'circle',
  class: 'fa-2x has-text-grey',
}
const iconLoading = {
  icon: 'spinner-third',
  class: 'fa-spin fa-2x',
}
const iconSuccess = {
  icon: 'check',
  class: 'fa-2x has-text-k-green',
}

const stepsIcon = (step: Steps) => {
  if (props.steps === 'step1') {
    return {
      step1: iconLoading,
      step2: iconIdle,
      step3: iconIdle,
    }[step]
  }

  if (props.steps === 'step2') {
    return {
      step1: iconSuccess,
      step2: iconLoading,
      step3: iconIdle,
    }[step]
  }

  if (props.steps === 'step3') {
    return {
      step1: iconSuccess,
      step2: iconSuccess,
      step3: iconLoading,
    }[step]
  }

  return iconIdle
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.v-border {
  width: 1px;
  background-color: black;
  margin-left: 20px;
  margin-right: 41px;
}
</style>

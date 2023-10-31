<template>
  <div>
    <!-- step 1 phase -->
    <div class="mb-5">
      <div class="is-flex is-align-items-center mb-4">
        <div class="mr-5"><NeoIcon v-bind="stepsIcon('step1')" /></div>
        <div>
          <p class="has-text-weight-bold">Initiation Phase</p>
          <p class="is-size-7 has-text-grey">
            Launching your journey with a first transaction that sets up
            everything needed on the new chain.
          </p>
        </div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div v-if="step1Status" class="mb-4">{{ step1Status }}/2 Left</div>
        <div v-else class="mb-4">Done</div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Create Collection</p>
            <nuxt-link
              v-if="retry === 0"
              target="_blank"
              class="has-text-k-blue"
              :to="`/${client}/collection/${nextId}`">
              View Tx <NeoIcon icon="arrow-up-right" />
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="is-flex is-size-7">
        <div class="v-border"></div>
        <div class="mb-4 is-flex">
          <!-- <NeoIcon icon="circle" class="mr-4" /> -->
          <div>
            <p>Automated Asset Preparation</p>
            <p>No Signature Needed</p>
          </div>
        </div>
      </div>
    </div>

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
  step1Status: number
  retry: number
  nextId: string
  itemCount?: string
}>()

const { client } = usePrefix()

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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.v-border {
  width: 1px;
  background-color: black;
  margin-left: 20px;
  margin-right: 41px;
}
</style>

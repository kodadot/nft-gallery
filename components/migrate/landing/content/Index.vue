<template>
  <div>
    <div v-if="loadingReady || loadingWaiting">
      <NeoSkeleton
        animated
        height="4rem"
      />
    </div>
    <div v-else-if="accountId && (isReady || isWaiting)">
      <!-- ready state for migration here -->
      <MigrateLandingContentReady
        v-if="isReady"
        :key="`${urlPrefix}-ready`"
      />

      <!-- waiting state for migration here -->
      <MigrateLandingContentWaiting
        v-if="isWaiting"
        :key="`${urlPrefix}-waiting`"
      />
    </div>

    <!-- empty state collection here -->
    <div
      v-else-if="!loadingReady && !loadingWaiting && !isReady && !isWaiting"
      class="text-center"
    >
      <p class="text-2xl font-bold">
        Nothing to Migrate
      </p>
      <p>
        It looks like you have no collections or items ready for migration at
        this time.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
import { useReadyItems, useWaitingItems } from '@/composables/useMigrate'

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { entities: readyItems, loading: loadingReady } = useReadyItems()
const { entities: waitingItems, loading: loadingWaiting } = useWaitingItems()

const isReady = computed(() => Object.keys(readyItems).length)
const isWaiting = computed(() => Object.keys(waitingItems).length)
</script>

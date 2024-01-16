<template>
  <div>
    <div v-if="loadingReady || loadingWaiting">
      <NeoSkeleton animated height="4rem" />
    </div>
    <div v-else-if="accountId && (isReady || isWaiting)">
      <!-- ready state for migration here -->
      <MigrateLandingContentReady v-if="isReady" :key="`${urlPrefix}-ready`" />

      <!-- waiting state for migration here -->
      <MigrateLandingContentWaiting
        v-if="isWaiting"
        :key="`${urlPrefix}-waiting`" />
    </div>

    <!-- empty state collection here -->
    <div
      v-else-if="!loadingReady && !loadingWaiting && !isReady && !isWaiting"
      class="text-center">
      <p class="is-size-4 has-text-weight-bold">Nothing to Migrate</p>
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

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.section-title {
  img {
    position: absolute;
    top: -10px;
    left: -20px;
  }

  p {
    font-size: 1.5rem;
    font-weight: 700;
    margin-left: 2.5rem;
  }
}

.collection {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 2rem;

  @include ktheme() {
    &-card {
      position: relative;

      &-empty {
        display: none;
      }

      &-banner {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 16rem;
      }

      &-avatar {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow:
          0 0 0 1px theme('k-grey'),
          0 0 0 10px white,
          0 0 0 11px theme('k-grey');
        height: 5.5rem;
        width: 5.5rem;
        position: absolute;
        top: 8rem;
        left: 3rem;
      }

      &-info {
        background-color: theme('background-color');
        border-top: 1px solid theme('card-border-color');
        padding: 1.5rem 2rem;
      }

      &:hover {
        .collection-card-info {
          border-top: 1px solid theme('border-color');
        }
      }
    }
  }

  @include mobile() {
    grid-template-columns: repeat(1, minmax(0, 1fr));

    &-card-info .flex {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>

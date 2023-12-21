<template>
  <div>
    <div class="flex flex-column justify-between">
      <div>
        <div v-if="accountId" class="flex flex-column items-center">
          <p class="mr-4">{{ $t('migrate.resultFor') }}</p>
          <div class="flex">
            <Avatar :value="accountId" :size="26" class="mr-2" />
            <nuxt-link class="has-text-k-blue" :to="`/ksm/u/${accountId}`">
              <Identity :address="accountId" hide-identity-popover />
            </nuxt-link>
            <p class="ml-4">On RMRK2</p>
          </div>
        </div>
        <div v-else class="flex items-center">
          <p class="mr-4">{{ $t('migrate.connect') }}</p>
          <ConnectWalletButton no-shadow variant="k-accent" />
        </div>
      </div>

      <div class="question">
        <NeoTooltip
          multiline
          multiline-width="16rem"
          :label="$t('migrate.tooltipCollectionLabel')">
          <div class="flex items-center">
            <NeoIcon icon="circle-question" class="mr-2" />
            <p>{{ $t('migrate.tooltipCollection') }}</p>
          </div>
        </NeoTooltip>
      </div>
    </div>

    <hr />

    <div v-if="accountId">
      <!-- ready state for migration here -->
      <MigrateLandingContentReady :key="urlPrefix" />

      <!-- waiting state for migration here -->
      <MigrateLandingContentWaiting :key="urlPrefix" />
    </div>

    <!-- empty state collection here -->
    <!-- <div class="has-text-centered">
      <p class="is-size-4 has-text-weight-bold">Nothing to Migrate</p>
      <p>
        It looks like you have no collections or items ready for migration at
        this time.
      </p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.question {
  font-size: 12px;

  @include ktheme() {
    color: theme('k-grey');
  }

  @include mobile() {
    text-align: center;
  }
}

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

.flex-column {
  @include mobile() {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

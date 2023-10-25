<template>
  <div>
    <div class="is-flex flex-column is-justify-content-space-between">
      <div>
        <div v-if="accountId" class="is-flex flex-column is-align-items-center">
          <p class="mr-4">{{ $t('migrate.resultFor') }}</p>
          <div class="is-flex">
            <Avatar :value="accountId" :size="26" class="mr-2" />
            <nuxt-link class="has-text-k-blue" :to="`/ksm/u/${accountId}`">
              <Identity :address="accountId" hide-identity-popover />
            </nuxt-link>
            <p class="ml-4">On RMRK2</p>
          </div>
        </div>
        <div v-else class="is-flex is-align-items-center">
          <p class="mr-4">{{ $t('migrate.connect') }}</p>
          <ConnectWalletButton no-shadow variant="k-accent" />
        </div>
      </div>

      <div class="question">
        <NeoTooltip
          multiline
          multiline-width="16rem"
          :label="$t('migrate.tooltipCollectionLabel')">
          <div class="is-flex is-align-items-center">
            <NeoIcon icon="circle-question" class="mr-2" />
            <p>{{ $t('migrate.tooltipCollection') }}</p>
          </div>
        </NeoTooltip>
      </div>
    </div>

    <hr />

    <!-- ready state for migration here -->
    <div v-if="accountId">
      <div class="mt-8 pt-4">
        <div class="is-flex is-relative section-title">
          <img src="/migrate/state-ready.svg" alt="Ready" />
          <p>{{ $t('migrate.ready.title') }}</p>
        </div>

        <div class="has-text-grey mt-2">
          {{ $t('migrate.ready.desc') }}
        </div>

        <div class="collection">
          <div
            v-for="cl in dummyReadyCollections"
            :key="cl"
            class="collection-card">
            <div
              class="collection-card-banner"
              :style="{ backgroundImage: `url(${cl})` }"></div>
            <div
              class="collection-card-avatar"
              :style="{ backgroundImage: `url(${cl})` }"></div>

            <div class="collection-card-info">
              <div
                class="is-flex is-justify-content-space-between is-align-items-center">
                <div>
                  <p class="is-size-5 has-text-weight-bold">
                    You Like This Window
                  </p>
                  <p>
                    <span class="has-text-grey mr-2">
                      {{ $t('migrate.ready.status') }}
                    </span>
                    <span>130/200 Items </span>
                  </p>
                </div>
                <div>
                  <NeoButton variant="pill" @click="toReview()">
                    {{ $t('migrate.ready.cta') }}
                  </NeoButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- waiting state for migration here -->
      <div class="mt-8 pt-4">
        <div class="is-flex is-relative section-title">
          <img src="/migrate/state-waiting.svg" alt="Ready" />
          <p>{{ $t('migrate.waiting.title') }}</p>
        </div>

        <div class="has-text-grey mt-2">
          {{ $t('migrate.waiting.desc') }}
        </div>

        <div class="collection">
          <div
            v-for="cl in dummyWaitingCollections"
            :key="cl"
            class="collection-card">
            <div
              class="collection-card-banner"
              :style="{ backgroundImage: `url(${cl})` }"></div>
            <div
              class="collection-card-avatar"
              :style="{ backgroundImage: `url(${cl})` }"></div>

            <div class="collection-card-info">
              <p class="is-size-5 has-text-weight-bold">Hmm Vacation Nice</p>
              <p>
                <span class="has-text-grey mr-2">
                  {{ $t('migrate.waiting.status') }}
                </span>
                <a href="#!" class="has-text-k-blue">Another nice name </a>
              </p>
            </div>

            <div class="collection-card-info">
              <div
                class="is-flex is-justify-content-space-between is-align-items-center">
                <div>
                  <p v-dompurify-html="$t('migrate.waiting.own', ['12'])"></p>
                </div>
                <div>
                  <NeoButton variant="pill" @click="toReview()">
                    {{ $t('migrate.waiting.cta') }}
                  </NeoButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-4">
        <hr />
        <p class="has-text-grey mb-2">
          {{ $t('migrate.migrationNotPossible') }}
        </p>
        <p>
          <span
            v-dompurify-html="$t('migrate.migrationNotPossibleLabel')"></span>
          <strong> Crazy dogs, Music album 101, I like good weather</strong>
        </p>
      </div>
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
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import useMigrate from '@/components/migrate/migrate'

const { sourceSelected, destinationSelected } = useMigrate()

const { accountId } = useAuth()
const dummyReadyCollections = [
  'https://plus.unsplash.com/premium_photo-1697188001642-92c80c7e0073?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
  'https://plus.unsplash.com/premium_photo-1695302440940-c954d78d8518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
]
const dummyWaitingCollections = [
  'https://plus.unsplash.com/premium_photo-1664640458486-1ef3c8738cf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
]

const toReview = () => {
  navigateTo({
    path: '/migrate/review',
    query: {
      collectionId: '12345789',
      source: sourceSelected.value?.value,
      destination: destinationSelected.value?.value,
    },
  })
}
</script>

<style lang="scss" scoped>
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
    font-weight: bold;
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

    &-card-info .is-flex {
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

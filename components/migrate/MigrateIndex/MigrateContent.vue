<template>
  <div>
    <div class="is-flex is-justify-content-space-between">
      <div>
        <div v-if="accountId" class="is-flex is-align-items-center">
          <p class="mr-4">Showing Results For:</p>
          <Avatar :value="accountId" :size="26" class="mr-2" />
          <nuxt-link class="has-text-k-blue" :to="`/ksm/u/${accountId}`">
            <Identity :address="accountId" hide-identity-popover />
          </nuxt-link>
          <p class="ml-4">On RMRK2</p>
        </div>
        <div v-else class="is-flex is-align-items-center">
          <p class="mr-4">
            To view and migrate assets, please connect your wallet.
          </p>
          <ConnectWalletButton no-shadow variant="k-accent" />
        </div>
      </div>

      <div class="is-flex is-align-items-center question">
        <NeoTooltip
          multiline
          multiline-width="16rem"
          label="Can't find your collection in the list? Make sure you're connected to the correct account/address that owns the collection.">
          <NeoIcon icon="circle-question" class="mr-2" />
        </NeoTooltip>
        <p>Don't See Your Collection?</p>
      </div>
    </div>

    <hr />

    <!-- ready state for migration here -->
    <div class="mb-6">
      <div class="is-flex is-relative section-title">
        <img src="/migrate/state-ready.svg" alt="Ready" />
        <p>Ready For Migration</p>
      </div>

      <div class="has-text-grey w-half mt-2">
        As the creator or owner of a collection, you can initiate migration
        here. Keep in mind, only items owned by you can be migrated at this
        stage. You'll need to pre-sign items owned by others to allow individual
        migrations.
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
                    Available For Migration
                  </span>
                  <span>130/200 Items </span>
                </p>
              </div>
              <div>
                <NeoButton variant="pill">Migrate Collection</NeoButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- waiting state for migration here -->
    <div class="mb-6">
      <div class="is-flex is-relative section-title">
        <img src="/migrate/state-waiting.svg" alt="Ready" />
        <p>Waiting For Your Action</p>
      </div>

      <div class="has-text-grey w-half mt-2">
        Displayed here are individual items that you own from collections that
        have been migrated. Ensure you're up-to-date by migrating these pieces
        right away. Please note, you can only start the migration once the
        collection owner initiates it.
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
                Collection Was Migrated By
              </span>
              <a href="#!" class="has-text-k-blue">Another nice name </a>
            </p>
          </div>

          <div class="collection-card-info">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center">
              <div>
                <p>You Own <strong>12 Items</strong> From This Collection</p>
              </div>
              <div>
                <NeoButton variant="pill">Migrate Items</NeoButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <p>Migration Not Possible:</p>
    <p>
      Migration Is <strong>Not Possible</strong> For Following Collections That
      You Own: <strong>Crazy dogs, Music album 101, I like good weather</strong>
    </p>

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

const { accountId } = useAuth()
const dummyReadyCollections = [
  'https://plus.unsplash.com/premium_photo-1697188001642-92c80c7e0073?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
  'https://plus.unsplash.com/premium_photo-1695302440940-c954d78d8518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
]
const dummyWaitingCollections = [
  'https://plus.unsplash.com/premium_photo-1664640458486-1ef3c8738cf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
]
</script>

<style lang="scss" scoped>
.question {
  color: grey;
  font-size: 12px;
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
        0 0 0 1px #999,
        0 0 0 10px white,
        0 0 0 11px #999;
      height: 5.5rem;
      width: 5.5rem;
      position: absolute;
      top: 8rem;
      left: 3rem;
    }

    &-info {
      border-top: 1px solid #999;
      padding: 1.5rem 2rem;
    }
  }
}
</style>

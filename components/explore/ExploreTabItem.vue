<template>
  <div class="mb-5 explore-tabs field has-addons is-flex" data-cy="tabs">
    <p class="control">
      <NeoButton
        class="explore-tabs-button"
        tag="nuxt-link"
        :active="selectedTab === TabType.COLLECTION"
        to="collectibles">
        <span> {{ $t('collections') }}</span>
        <img
          v-if="selectedTab === TabType.COLLECTION"
          src="/checkmark.svg"
          class="check-icon" />
      </NeoButton>
    </p>
    <p class="control">
      <NeoButton
        class="explore-tabs-button"
        tag="nuxt-link"
        :active="selectedTab === TabType.ITEMS"
        to="items">
        <span> {{ $t('items') }}</span>
        <img
          v-if="selectedTab === TabType.ITEMS"
          src="/checkmark.svg"
          class="check-icon" />
      </NeoButton>
    </p>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

enum TabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const route = useRoute()

const selectedTab = computed(() => route?.name?.split('-')[2])
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.explore-tabs {
  &-button {
    width: 15rem;
  }

  @include mobile {
    .control,
    &-button {
      width: 100%;
    }
  }
}

.dark-mode .explore-tabs-button.active img {
  filter: brightness(0%);
}
</style>

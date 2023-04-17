<template>
  <div>
    <section class="is-flex pb-8 is-flex-wrap-wrap row-gap">
      <NeoButton class="mr-8" @click.native="toOnborading">
        <NeoIcon icon="arrow-left" size="small" class="mr-1" />
        {{ $t('massmint.backToOnbaording') }}
      </NeoButton>
      <div class="is-flex">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          :active="tab === 'Mass Mint'"
          :text="tab"
          :to="route.path"
          class="mobile-width" />
      </div>
    </section>
    <hr class="m-0" />
    <section
      class="pt-8 is-flex is-flex-direction-column is-align-items-center">
      <p class="mb-4">{{ $t('massmint.chooseCollection') }}</p>
      <NeoDropdown
        class="dropdown-width"
        :disabled="!isLogIn"
        @active-change="toggleOpen">
        <NeoButton
          v-if="!selectedCollection"
          class="dropdown-width"
          :label="$t('massmint.selectCollection')"
          :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'" />
        <NeoButton
          v-else
          class="dropdown-width"
          :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'">
          {{ selectedCollection.name || selectedCollection.id }}
          <NeoIcon
            v-if="selectedCollection"
            icon="circle-check"
            size="small"
            variant="success"
            class="ml-3" />
        </NeoButton>
        <template v-if="collectionsEntites?.length" #items>
          <NeoDropdownItem
            v-for="collection in collectionsEntites"
            :key="collection.id"
            class="dropdown-width"
            @click.native="selectCollection(collection)">
            {{ collection.name || collection.id }}
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width" has-link>
            <nuxt-link :to="`/${urlPrefix}/create`" class="w-100">
              <div class="w-100">
                <NeoIcon icon="plus" size="small" class="mr-1" />
                {{ $t('massmint.createNewCollection') }}
              </div>
            </nuxt-link>
          </NeoDropdownItem>
        </template>
        <template v-else #items>
          <NeoDropdownItem disabled class="dropdown-width">
            {{ $t('massmint.noCollection') }}
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width">
            <div class="w-100">
              <NeoIcon icon="plus" size="small" class="mr-1" />
              {{ $t('massmint.createNewCollection') }}
            </div>
          </NeoDropdownItem>
        </template>
      </NeoDropdown>
    </section>
    <section class="collpase-massmint-container mt-7">
      <UploadPicture :disabled="!selectedCollection" />
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
} from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { MintedCollection, useMassMint } from './useMassMint'
import UploadPicture from '@/components/massmint/UploadPicture/UploadPicture.vue'

const preferencesStore = usePreferencesStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()

const tabs = ['Collection', 'NFT', 'Mass Mint']

const { collectionsEntites } = useMassMint()
const isDropdownopen = ref(false)
const selectedCollection = ref<MintedCollection>()

watch(accountId, () => {
  selectedCollection.value = undefined
})

const toggleOpen = () => {
  isDropdownopen.value = !isDropdownopen.value
}
const selectCollection = (collection) => {
  selectedCollection.value = collection
}

const toOnborading = () => {
  preferencesStore.setVisitedOnboarding(false)
  router
    .replace({
      path: `/${urlPrefix.value}/massmint/onboarding`,
    })
    .catch($consola.warn)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.dropdown-width {
  width: 30rem;
}
@include mobile {
  .dropdown-width {
    width: 100%;
  }
  .mobile-width {
    min-width: 6rem;
  }
}
.row-gap {
  row-gap: 2rem;
}
.w-100 {
  width: 100%;
}
.collpase-massmint-container {
  @include ktheme() {
    background-color: theme('background-color');
    color: theme('text-color');
    border: 1px solid theme('border-color');
    box-shadow: theme('primary-shadow');
  }
}
</style>

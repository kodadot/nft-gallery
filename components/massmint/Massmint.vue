<template>
  <div>
    <section class="is-flex pb-6 is-flex-wrap-wrap row-gap">
      <NeoButton class="mr-6" @click.native="toOnborading">
        <o-icon pack="fas" icon="arrow-left" size="small" class="mr-1" />
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
      class="pt-6 is-flex is-flex-direction-column is-align-items-center">
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
          <o-icon
            v-if="selectedCollection"
            icon="check"
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
            <span class="px-5">
              {{ collection.name || collection.id }}
            </span>
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width" has-link>
            <nuxt-link :to="`/${urlPrefix}/create`" class="w-100">
              <div class="w-100">
                <o-icon pack="fas" icon="plus" size="small" class="mr-1">
                </o-icon>
                {{ $t('massmint.createNewCollection') }}
              </div>
            </nuxt-link>
          </NeoDropdownItem>
        </template>
        <template v-else #items>
          <NeoDropdownItem disabled class="dropdown-width">
            <span class="px-5"> {{ $t('massmint.noCollection') }} </span>
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width">
            <div class="w-100">
              <o-icon pack="fas" icon="plus" size="small" class="mr-1">
              </o-icon>
              {{ $t('massmint.createNewCollection') }}
            </div>
          </NeoDropdownItem>
        </template>
      </NeoDropdown>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { OIcon } from '@oruga-ui/oruga'
import { usePreferencesStore } from '@/stores/preferences'
import { MintedCollection, useMassMint } from './useMassMint'
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

.o-icon--success {
  @include ktheme() {
    color: theme('k-green');
  }
}
</style>

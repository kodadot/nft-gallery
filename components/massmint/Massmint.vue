<template>
  <div>
    <section class="is-flex pb-6">
      <NeoButton
        :label="'to onboarding'"
        icon="arrow-right"
        icon-pack="fas"
        class="mr-6"
        @click.native="toOnborading" />
      <div class="is-flex ml-6">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          :active="tab === 'Mass Mint'"
          :text="tab"
          :to="route.path" />
      </div>
    </section>
    <hr class="m-0" />
    <section
      class="pt-6 is-flex is-flex-direction-column is-align-items-center">
      <p class="mb-4">Choose a collection to which you want to mint</p>
      <NeoDropdown
        class="dropdown-width"
        :disabled="!isLogIn"
        @active-change="toggleOpen">
        <NeoButton
          v-if="!selectedCollection"
          class="dropdown-width"
          :label="'Select Collection'"
          :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'" />
        <NeoButton
          v-else
          class="dropdown-width"
          :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'">
          {{ selectedCollection }}
          <o-icon
            v-if="selectedCollection"
            icon="check"
            size="small"
            variant="success"
            class="ml-3" />
        </NeoButton>
        <template v-if="collectionsEntites?.length" #items>
          <NeoDropdownItem
            v-for="c in collectionsEntites"
            :key="c.id"
            class="dropdown-width"
            @click.native="selectCollection(c.name)">
            <span class="px-5">
              {{ c.name }}
            </span>
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width">
            <div>
              <o-icon pack="fas" icon="plus" size="small" class="mr-1">
              </o-icon>
              <span>Create New Collection</span>
            </div>
          </NeoDropdownItem>
        </template>
        <template v-else #items>
          <NeoDropdownItem disabled class="dropdown-width">
            <span class="px-5"> No Collection </span>
          </NeoDropdownItem>
          <NeoDropdownItem class="dropdown-width">
            <div>
              <o-icon pack="fas" icon="plus" size="small" class="mr-1" />
              <span>Create New Collection</span>
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
import { useMassmintsStore } from '@/stores/massmint'
import TabItem from '@/components/explore/tab/TabItem.vue'
import { useMassMint } from './useMassMint'
const massMintStore = useMassmintsStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()

const tabs = ['Collection', 'NFT', 'Mass Mint']

const { collectionsEntites } = useMassMint()
const isDropdownopen = ref(false)
const selectedCollection = ref<string>()

watch(accountId, () => {
  selectedCollection.value = undefined
})

const toggleOpen = () => {
  isDropdownopen.value = !isDropdownopen.value
}
const selectCollection = (name: string) => {
  selectedCollection.value = name
}

const toOnborading = () => {
  massMintStore.setVisitedOnboarding(false)
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
.max-width {
  max-width: 466px;
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

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
      <NeoDropdown class="w-40 max-width">
        <NeoButton
          class="w-100"
          :label="'Select Collection'"
          icon="chevron-down" />
        <template #items>
          <NeoDropdownItem
            v-for="c in collectionsEntites"
            :key="c.id"
            :item="c.name">
          </NeoDropdownItem>
        </template>
      </NeoDropdown>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { useMassmintsStore } from '@/stores/massmint'
import TabItem from '@/components/explore/tab/TabItem.vue'
import { useMassMint } from './useMassMint'
const massMintStore = useMassmintsStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()

const tabs = ['Collection', 'NFT', 'Mass Mint']

const { collectionsEntites } = useMassMint()

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
.w-40 {
  width: 40%;
}
.max-width {
  max-width: 466px;
}
.w-100 {
  width: 100%;
}
</style>

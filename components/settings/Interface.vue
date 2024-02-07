<template>
  <div>
    <div class="label text-xs/normal">
      {{ $t('user interface mode') }}
    </div>
    <NeoSwitch v-model="enabledAdvancedUI" size="is-medium">
      {{
        enabledAdvancedUI
          ? $t('advanced user interface')
          : $t('basic user interface')
      }}
    </NeoSwitch>
    <div class="box">
      <div>
        <NeoCheckbox
          v-model="compactGalleryItem"
          :disabled="!enabledAdvancedUI">
          {{ $t('preferences.fold.history') }}
        </NeoCheckbox>
      </div>
      <div>
        <NeoCheckbox v-model="compactCollection" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.fold.description') }}
        </NeoCheckbox>
      </div>
      <div>
        <NeoCheckbox
          v-model="replaceBuyNowWithYolo"
          :disabled="!enabledAdvancedUI">
          {{ $t('preferences.yolo') }}
        </NeoCheckbox>
      </div>
      <div>
        <NeoCheckbox v-model="showPriceValue" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.priceVisible') }}
        </NeoCheckbox>
      </div>
      <div>
        <NeoCheckbox v-model="showMintTime" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.mintTimeVisible') }}
        </NeoCheckbox>
      </div>
      <div>
        <NeoCheckbox v-model="enableAllArtworks" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.loadAllArtworks') }}
        </NeoCheckbox>
      </div>
      <div class="layout-wrapper">
        <div class="label text-xs/normal">
          {{ $t('Layout Options') }}
        </div>
        <Layout :disabled="!enabledAdvancedUI" position="is-left" />
      </div>
      <NeoField :label="$t('Gallery Items Per Page')" class="field-width">
        <NeoSelect
          v-model="galleryItemsPerPage"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </NeoSelect>
      </NeoField>
      <NeoField :label="$t('Collections Per Page')" class="field-width">
        <NeoSelect
          v-model="collectionsPerPage"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </NeoSelect>
      </NeoField>
      <NeoField :label="$t('preferences.exploreTabOrder')" class="field-width">
        <NeoSelect
          v-model="exploreTabOrder"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in exploreTabOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </NeoSelect>
      </NeoField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'
import { NeoCheckbox, NeoField, NeoSelect, NeoSwitch } from '@kodadot1/brick'
import Layout from '@/components/rmrk/Gallery/Layout.vue'

const paginationOptions = ref([9, 12, 24, 36])
const exploreTabOptions = ref(['GALLERY', 'COLLECTION'])
const preferencesStore = usePreferencesStore()

const enabledAdvancedUI = computed({
  get: () => preferencesStore.advancedUI,
  set: (value) => preferencesStore.setAdvancedUI(value),
})
const compactGalleryItem = computed({
  get: () => preferencesStore.compactGalleryItem,
  set: (value) => preferencesStore.setCompactGalleryItem(value),
})
const compactCollection = computed({
  get: () => preferencesStore.compactCollection,
  set: (value) => preferencesStore.setCompactCollection(value),
})
const showPriceValue = computed({
  get: () => preferencesStore.showPriceGallery,
  set: (value) => preferencesStore.setShowPriceValue(value),
})
const showMintTime = computed({
  get: () => preferencesStore.showMintTimeCollection,
  set: (value) => preferencesStore.setShowMintTime(value),
})
const replaceBuyNowWithYolo = computed({
  get: () => preferencesStore.replaceBuyNowWithYolo,
  set: (value) => preferencesStore.setReplaceBuyNowWithYolo(value),
})
const galleryItemsPerPage = computed({
  get: () => preferencesStore.galleryItemsPerPage,
  set: (value) => preferencesStore.setGalleryItemsPerPage(value),
})
const collectionsPerPage = computed({
  get: () => preferencesStore.collectionsPerPage,
  set: (value) => preferencesStore.setCollectionsPerPage(value),
})
const exploreTabOrder = computed({
  get: () => preferencesStore.exploreTabOrder,
  set: (value) => preferencesStore.setExploreTabOrder(value),
})
const enableAllArtworks = computed({
  get: () => preferencesStore.enableAllArtwork,
  set: (value) => preferencesStore.setAllArtworkVisible(value),
})
</script>

<style scoped>
.field-width {
  max-width: 250px;
}
.layout-wrapper {
  margin-bottom: 1em;
}
</style>

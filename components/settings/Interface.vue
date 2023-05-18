<template>
  <div>
    <div class="label">
      {{ $t('user interface mode') }}
    </div>
    <NeoSwitch v-model="enabledAdvancedUI" size="is-medium" :rounded="false">
      {{
        enabledAdvancedUI
          ? $t('advanced user interface')
          : $t('basic user interface')
      }}
    </NeoSwitch>
    <div class="box">
      <div>
        <NeoCheckbox v-model="theatreView" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.theater') }}
        </NeoCheckbox>
      </div>
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
      <div>
        <NeoCheckbox v-model="enableGyroEffect" :disabled="!enabledAdvancedUI">
          {{ $t('preferences.enableGyroEffect') }}
        </NeoCheckbox>
      </div>
      <div class="layout-wrapper">
        <div class="label">
          {{ $t('Layout Options') }}
        </div>
        <Layout :disabled="!enabledAdvancedUI" position="is-left" />
      </div>
      <NeoField :label="$t('Gallery Items Per Page')" class="field-width">
        <b-select
          v-model="galleryItemsPerPage"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </b-select>
      </NeoField>
      <NeoField :label="$t('Collections Per Page')" class="field-width">
        <b-select
          v-model="collectionsPerPage"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </b-select>
      </NeoField>
      <NeoField :label="$t('preferences.exploreTabOrder')" class="field-width">
        <b-select
          v-model="exploreTabOrder"
          expanded
          :disabled="!enabledAdvancedUI">
          <option
            v-for="option in exploreTabOptions"
            :key="option"
            :value="option">
            {{ option }}
          </option>
        </b-select>
      </NeoField>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoCheckbox, NeoField, NeoSwitch } from '@kodadot1/brick'

@Component({
  components: {
    Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
    NeoField,
    NeoSwitch,
    NeoCheckbox,
  },
})
export default class Interface extends Vue {
  public paginationOptions = [9, 12, 24, 36]
  public exploreTabOptions = ['GALLERY', 'COLLECTION']
  private preferencesStore = usePreferencesStore()

  get enabledAdvancedUI(): boolean {
    return this.preferencesStore.advancedUI
  }

  set enabledAdvancedUI(value: boolean) {
    this.preferencesStore.setAdvancedUI(value)
  }

  get theatreView(): boolean {
    return this.preferencesStore.theatreView === 'theatre'
  }

  set theatreView(value: boolean) {
    this.preferencesStore.setTheatreView(value)
  }

  get compactGalleryItem(): boolean {
    return this.preferencesStore.compactGalleryItem
  }

  set compactGalleryItem(value: boolean) {
    this.preferencesStore.setCompactGalleryItem(value)
  }

  get compactCollection(): boolean {
    return this.preferencesStore.compactCollection
  }

  set compactCollection(value: boolean) {
    this.preferencesStore.setCompactCollection(value)
  }

  get showPriceValue(): boolean {
    return this.preferencesStore.showPriceGallery
  }

  set showPriceValue(value: boolean) {
    this.preferencesStore.setShowPriceValue(value)
  }

  get showMintTime(): boolean {
    return this.preferencesStore.showMintTimeCollection
  }

  set showMintTime(value: boolean) {
    this.preferencesStore.setShowMintTime(value)
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.preferencesStore.replaceBuyNowWithYolo
  }

  set replaceBuyNowWithYolo(value: boolean) {
    this.preferencesStore.setReplaceBuyNowWithYolo(value)
  }

  get galleryItemsPerPage(): number {
    return this.preferencesStore.galleryItemsPerPage
  }

  set galleryItemsPerPage(value: number) {
    this.preferencesStore.setGalleryItemsPerPage(value)
  }

  get collectionsPerPage(): number {
    return this.preferencesStore.collectionsPerPage
  }

  set collectionsPerPage(value: number) {
    this.preferencesStore.setCollectionsPerPage(value)
  }

  get exploreTabOrder(): string {
    return this.preferencesStore.exploreTabOrder
  }

  set exploreTabOrder(value: string) {
    this.preferencesStore.setExploreTabOrder(value)
  }

  get enableAllArtworks(): boolean {
    return this.preferencesStore.enableAllArtwork
  }

  set enableAllArtworks(value: boolean) {
    this.preferencesStore.setAllArtworkVisible(value)
  }

  get enableGyroEffect(): boolean {
    return this.preferencesStore.enableGyroEffect
  }

  set enableGyroEffect(value: boolean) {
    this.preferencesStore.setEnableGyroEffect(value)
  }
}
</script>

<style scoped>
.field-width {
  max-width: 250px;
}
.layout-wrapper {
  margin-bottom: 1em;
}
</style>

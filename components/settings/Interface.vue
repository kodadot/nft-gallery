<template>
  <div>
    <div class="label">
      {{ $t('user interface mode') }}
    </div>
    <b-switch v-model="enabledAdvancedUI" size="is-medium" :rounded="false">
      {{
        enabledAdvancedUI
          ? $t('advanced user interface')
          : $t('basic user interface')
      }}
    </b-switch>
    <div class="box">
      <BasicCheckbox
        v-model="theatreView"
        :disabled="!enabledAdvancedUI"
        label="preferences.theater" />
      <BasicCheckbox
        v-model="compactGalleryItem"
        :disabled="!enabledAdvancedUI"
        label="preferences.fold.history" />
      <BasicCheckbox
        v-model="compactCollection"
        :disabled="!enabledAdvancedUI"
        label="preferences.fold.description" />
      <BasicCheckbox
        v-model="replaceBuyNowWithYolo"
        :disabled="!enabledAdvancedUI"
        label="preferences.yolo" />
      <BasicCheckbox
        v-model="showPriceValue"
        :disabled="!enabledAdvancedUI"
        label="preferences.priceVisible" />
      <BasicCheckbox
        v-model="enableAllArtworks"
        :disabled="!enabledAdvancedUI"
        label="preferences.loadAllArtworks" />
      <BasicCheckbox
        v-model="enableAllArtworks"
        :disabled="!enabledAdvancedUI"
        label="preferences.autoGenerateSymbol" />
      <div class="layout-wrapper">
        <div class="label">
          {{ $t('Layout Options') }}
        </div>
        <Layout :disabled="!enabledAdvancedUI" position="is-left" />
      </div>
      <b-field :label="$t('Gallery Items Per Page')" class="field-width">
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
      </b-field>
      <b-field :label="$t('Collections Per Page')" class="field-width">
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
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    BasicCheckbox: () => import('@/components/shared/form/BasicCheckbox.vue'),
    Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  },
})
export default class Interface extends Vue {
  public paginationOptions = [9, 12, 24, 36]

  get enabledAdvancedUI(): boolean {
    return this.$store.state.preferences.advancedUI
  }

  set enabledAdvancedUI(value: boolean) {
    this.$store.dispatch('preferences/setAdvancedUI', value)
  }

  get theatreView(): boolean {
    return this.$store.state.preferences.theatreView === 'theatre'
  }

  set theatreView(value: boolean) {
    this.$store.dispatch('preferences/setTheatreView', value)
  }

  get compactGalleryItem(): boolean {
    return this.$store.state.preferences.compactGalleryItem
  }

  set compactGalleryItem(value: boolean) {
    this.$store.dispatch('preferences/setCompactGalleryItem', value)
  }

  get compactCollection(): boolean {
    return this.$store.state.preferences.compactCollection
  }

  set compactCollection(value: boolean) {
    this.$store.dispatch('preferences/setCompactCollection', value)
  }

  get showPriceValue(): boolean {
    return this.$store.state.preferences.showPriceGallery
  }

  set showPriceValue(value: boolean) {
    this.$store.dispatch('preferences/setShowPriceValue', value)
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.state.preferences.replaceBuyNowWithYolo
  }

  set replaceBuyNowWithYolo(value: boolean) {
    this.$store.dispatch('preferences/setReplaceBuyNowWithYolo', value)
  }

  get galleryItemsPerPage(): number {
    return this.$store.state.preferences.galleryItemsPerPage
  }

  set galleryItemsPerPage(value: number) {
    this.$store.dispatch('preferences/setGalleryItemsPerPage', value)
  }

  get collectionsPerPage(): number {
    return this.$store.state.preferences.collectionsPerPage
  }

  set collectionsPerPage(value: number) {
    this.$store.dispatch('preferences/setCollectionsPerPage', value)
  }

  get enableAllArtworks(): boolean {
    return this.$store.state.preferences.enableAllArtwork
  }

  set enableAllArtworks(value: boolean) {
    this.$store.dispatch('preferences/setAllArtworkVisible', value)
  }

  get autoGenerateSymbol(): boolean {
    return this.$store.state.preferences.autoGenerateSymbol
  }

  set autoGenerateSymbol(value: boolean) {
    this.$store.dispatch('preferences/autoGenerateSymbol', value)
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

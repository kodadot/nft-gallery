<template>
  <div>
    <div class="label">
      User Interface Mode
    </div>
    <b-switch v-model="enabledAdvancedUI" size="is-medium" :rounded="false">
        {{ enabledAdvancedUI ? 'Advanced User Interface' : 'Basic User Interface' }}
    </b-switch>
    <div class="box">
      <b-field>
          <b-checkbox v-model="theatreView" :disabled="!enabledAdvancedUI">
              Enable "Theatre View" on default
          </b-checkbox>
      </b-field>
        <b-field>
          <b-checkbox v-model="compactGalleryItem" :disabled="!enabledAdvancedUI">
              Fold history and price chart in NFT view on default
          </b-checkbox>
      </b-field>
      <b-field>
          <b-checkbox v-model="compactCollection" :disabled="!enabledAdvancedUI">
              Fold description in collection view on defult
          </b-checkbox>
      </b-field>
      <b-field>
          <b-checkbox v-model="showLayoutOptions" :disabled="!enabledAdvancedUI">
              Show layout options in collection view
          </b-checkbox>
      </b-field>
      <b-field label="allery Items Per Page" class="field-width">
        <b-select
          v-model="galleryItemsPerPage"
          expanded
          placeholder="Items Per Page"
          :disabled="!enabledAdvancedUI"
        >
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Collections Per Page" class="field-width">
        <b-select
          v-model="collectionsPerPage"
          expanded
          placeholder="Items Per Page"
          :disabled="!enabledAdvancedUI"
        >
          <option
            v-for="option in paginationOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
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

  get showLayoutOptions(): boolean {
    return this.$store.state.preferences.showLayoutOptions
  }

  set showLayoutOptions(value: boolean) {
    this.$store.dispatch('preferences/setShowLayoutOptions', value)
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
}
</script>

<style scoped>
.field-width {
  max-width: 250px;
}
</style>

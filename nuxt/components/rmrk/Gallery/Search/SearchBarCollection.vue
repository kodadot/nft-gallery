<template>
  <div class="box mb-3 mt-5">
    <b-field grouped>
      <b-field>
        <b-button
          aria-controls="contentIdForA11y1"
          label="Filter"
          icon-left="filter"
          type="is-primary"
          expanded
          @click="isVisible = !isVisible"
        />
      </b-field>
      <b-field expanded>
        <b-input
          v-model="searchQuery"
          placeholder="Search..."
          type="search"
          icon="search"
          expanded
        />
      </b-field>
      <BasicSwitch
        v-model="vListed"
        class="is-flex"
        label="sort.listed"
        size="is-medium"
      />
    </b-field>
    <slot />

    <transition name="fade">
      <div v-if="isVisible">
        <Sort
          :value="sortBy"
          @input="updateSortBy"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import shouldUpdate from '@/utils/shouldUpdate'
import { exist } from './exist'

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  },
})
export default class SearchBar extends Vue {
  @Prop(String) public search!: string
  @Prop(String) public type!: string
  @Prop(String) public sortBy!: string
  @Prop(Boolean) public listed!: boolean

  protected isVisible = false

  public mounted(): void {
    exist(this.$route.query.search, this.updateSearch)
    exist(this.$route.query.type, this.updateType)
    exist(this.$route.query.sort, this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
  }

  get vListed(): boolean {
    return this.listed
  }

  set vListed(listed: boolean) {
    this.updateListed(listed)
  }

  get searchQuery(): string {
    return this.search
  }

  set searchQuery(value: string) {
    this.updateSearch(value)
  }

  get typeQuery(): string {
    return this.type
  }

  set typeQuery(value: string) {
    this.updateType(value)
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(value: string | boolean): boolean {
    const v = String(value)
    this.replaceUrl(v, 'listed')
    return v === 'true'
  }

  @Emit('update:type')
  @Debounce(50)
  updateType(value: string): string {
    this.replaceUrl(value, 'type')
    return value
  }

  @Emit('update:sortBy')
  @Debounce(400)
  updateSortBy(value: string): string {
    this.replaceUrl(value, 'sort')
    return value
  }

  @Emit('update:search')
  @Debounce(400)
  updateSearch(value: string): string {
    shouldUpdate(value, this.searchQuery) && this.replaceUrl(value)
    return value
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'search'): void {
    this.$router
      .replace({
        name: String(this.$route.name),
        query: {
          ...this.$route.query,
          search: this.searchQuery,
          [key]: value,
        },
      })
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.card {
  box-shadow: 0px 0px 5px 0.5px $primary;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

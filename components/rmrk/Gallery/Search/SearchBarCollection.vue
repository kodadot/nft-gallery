<template>
  <div class="content">
    <b-field grouped group-multiline>
      <Sort
        class="control"
        :value="sortBy"
        @input="updateSortBy"
      />
      <b-field expanded class="control">
        <b-input
          placeholder="Search..."
          type="search"
          v-model="searchQuery"
          icon="search"
          expanded
        >
        </b-input>
      </b-field>
      <b-tooltip :label="$i18n.t('tooltip.buy')">
        <BasicSwitch
         class="is-flex control mb-5"
         v-model="vListed"
         label="sort.listed"
         size="is-medium"
         labelColor="is-success"
        />
      </b-tooltip>
      <slot />
    </b-field>
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
        path: String(this.$route.path),
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

<template>
  <div>
    <NeoSidebar :reduce="false" :open="open" :class="{ 'mr-4': open }">
      <b-collapse :open="false" animation="slide">
        <template #trigger="props">
          <div class="is-flex" role="button" :aria-expanded="props.open">
            <p
              :class="[
                'card-header-title',
                {
                  'has-text-weight-semibold': props.open,
                  'has-text-weight-normal': !props.open,
                },
              ]">
              {{ $t('tabs.properties') }}
            </p>
            <a class="card-header-icon">
              {{ props.open ? '-' : '+' }}
            </a>
          </div>
        </template>
        <div class="p-4">Yeet!</div>
      </b-collapse>
      <b-collapse :open="false" animation="slide">
        <template #trigger="props">
          <div class="is-flex" role="button" :aria-expanded="props.open">
            <p
              :class="[
                'card-header-title',
                {
                  'has-text-weight-semibold': props.open,
                  'has-text-weight-normal': !props.open,
                },
              ]">
              {{ $t('tabs.tabActivity.price') }}
            </p>
            <a class="card-header-icon">
              {{ props.open ? '-' : '+' }}
            </a>
          </div>
        </template>
        <div class="p-4">
          <b-input
            v-model="range[0]"
            type="number"
            min="0"
            step="any"
            :placeholder="$t('query.priceRange.minPrice')"
            data-cy="input-min">
          </b-input>
          <b-input
            v-model="range[1]"
            min="0"
            step="any"
            type="number"
            :placeholder="$t('query.priceRange.maxPrice')"
            data-cy="input-max">
          </b-input>
        </div>
      </b-collapse>
      <b-collapse :open="true" animation="slide">
        <template #trigger="props">
          <div class="is-flex" role="button" :aria-expanded="props.open">
            <p
              :class="[
                'card-header-title',
                {
                  'has-text-weight-semibold': props.open,
                  'has-text-weight-normal': !props.open,
                },
              ]">
              {{ $t('offer.status') }}
            </p>
            <a class="card-header-icon">
              {{ props.open ? '-' : '+' }}
            </a>
          </div>
        </template>
        <div class="p-4">
          <BasicSwitch v-model="listed" label="sort.listed" />
          <BasicSwitch v-model="owned" label="sort.own" />
        </div>
      </b-collapse>
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoSidebar } from '@kodadot1/brick'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'

const { $store } = useNuxtApp()
const route = useRoute()
const range = ref([0, 0])
const open = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)
const listed = ref(false)
const owned = ref(false)

const query = ref({
  search: route.query?.search?.toString() ?? '',
  type: route.query?.type?.toString() ?? '',
  listed: route.query?.listed?.toString() === 'true',
})
</script>

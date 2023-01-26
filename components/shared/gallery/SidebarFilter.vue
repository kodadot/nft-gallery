<template>
  <div :class="{ 'mr-4 bordered': open }">
    <NeoSidebar :reduce="false" :open="open" fullheight>
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

const { $store, $consola } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const range = ref([0, 0])
const open = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)
const emit = defineEmits(['resetPage'])

const query = ref({
  search: route.query?.search?.toString() ?? '',
  type: route.query?.type?.toString() ?? '',
  listed: route.query?.listed?.toString() === 'true',
})

const listed = computed({
  get: () => route.query?.listed?.toString() === 'true',
  set: (value) => replaceUrl({ listed: String(value) }),
})
const owned = computed({
  get: () => route.query?.owned?.toString() === 'true',
  set: (value) => replaceUrl({ owned: String(value) }),
})

const replaceUrl = (
  queryCondition: { [key: string]: any },
  pathName?: string
) => {
  if (pathName && pathName !== route.path) {
    return
  }
  router
    .replace({
      path: String(route.path),
      query: {
        page: '1',
        ...route.query,
        ...queryCondition,
        // search: query || undefined,
      },
    })
    .catch($consola.warn)
  emit('resetPage')
}
</script>

<style lang="scss" scoped>
.bordered {
  height: 100%;
  border-right: 1px solid;
}
</style>

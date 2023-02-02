<template>
  <div :class="{ 'mr-4 bordered sticky': open }">
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
              {{ $t('tabs.tabActivity.price') }}
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'minus' : 'plus'" />
            </a>
          </div>
        </template>
        <form class="p-4" @submit.prevent="setPriceRange">
          <b-field label="MIN" label-position="inside">
            <b-input
              v-model="range.min"
              type="number"
              min="0"
              step="any"
              :placeholder="$t('query.priceRange.minPrice')"
              data-cy="input-min" />
          </b-field>
          <b-field label="MAX" label-position="inside">
            <b-input
              v-model="range.max"
              min="0"
              step="any"
              type="number"
              :placeholder="$t('query.priceRange.maxPrice')"
              data-cy="input-max" />
          </b-field>
          <NeoButton data-cy="apply" expanded @click.native="setPriceRange">
            {{ $t('general.apply') }}
          </NeoButton>
        </form>
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
              <b-icon :icon="props.open ? 'minus' : 'plus'" />
            </a>
          </div>
        </template>
        <div class="p-4">
          <b-field>
            <b-checkbox v-model="listed"> {{ $t('sort.listed') }} </b-checkbox>
          </b-field>
          <b-field>
            <b-checkbox v-model="owned"> {{ $t('sort.own') }} </b-checkbox>
          </b-field>
        </div>
      </b-collapse>
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoSidebar } from '@kodadot1/brick'
import { fromDecimals, toDecimals } from '@/utils/math'

const { $store, $consola } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { decimals } = useChain()
const range = ref({
  min: fromDecimals(Number(route.query?.min), decimals.value) || 0,
  max: fromDecimals(Number(route.query?.max), decimals.value) || 0,
})
const open = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)
const emit = defineEmits(['resetPage'])
const listed = computed({
  get: () => route.query?.listed?.toString() === 'true',
  set: (value) => replaceUrl({ listed: String(value) }),
})
const owned = computed({
  get: () => route.query?.owned?.toString() === 'true',
  set: (value) => replaceUrl({ owned: String(value) }),
})

onMounted(() => {
  console.log(open)
})

const setPriceRange = () => {
  const priceMin = range.value.min
    ? String(toDecimals(range.value.min, decimals.value))
    : undefined
  const priceMax = range.value.max
    ? String(toDecimals(range.value.max, decimals.value))
    : undefined

  replaceUrl({ listed: String(true), min: priceMin, max: priceMax })
}

const replaceUrl = (queryCondition: { [key: string]: any }) => {
  router
    .replace({
      path: String(route.path),
      query: {
        page: '1',
        ...route.query,
        ...queryCondition,
      },
    })
    .catch($consola.warn)
  emit('resetPage')
}
</script>

<style lang="scss" scoped>
.bordered {
  border-right: 1px solid;
}
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
}
</style>

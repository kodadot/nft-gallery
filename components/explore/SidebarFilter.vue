<template>
  <div :class="{ 'mr-5 bordered sticky': open }">
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
          <div class="is-flex input-container mb-4">
            <b-input
              v-model="range.min"
              custom-class="input-sidebar"
              type="number"
              min="0"
              step="any"
              :placeholder="$t('query.priceRange.minPrice')"
              data-cy="input-min" />
            <div class="is-flex is-align-items-center">
              <svg
                width="28"
                height="8"
                viewBox="0 0 28 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
                  fill="currentColor" />
              </svg>
            </div>
            <b-input
              v-model="range.max"
              custom-class="input-sidebar"
              min="0"
              step="any"
              type="number"
              :placeholder="$t('query.priceRange.maxPrice')"
              data-cy="input-max" />
          </div>
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
            <b-checkbox v-model="owned" :disabled="!accountId">
              {{ $t('sort.own') }}
            </b-checkbox>
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
const { accountId } = useAuth()
const range = ref({
  min: fromDecimals(Number(route.query?.min), decimals.value),
  max: fromDecimals(Number(route.query?.max), decimals.value),
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
        ...route.query,
        ...queryCondition,
        page: '1',
      },
    })
    .catch($consola.warn)
  emit('resetPage')
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
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

<style lang="scss">
@import '@/styles/abstracts/variables';

.input-container {
  @include ktheme() {
    border: 1px solid theme('text-color');
  }
  .input-sidebar {
    border: none !important;
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>

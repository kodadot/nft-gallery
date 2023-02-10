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
          <div
            class="is-flex input-container mb-4"
            :class="[inputFocused ? 'input-focused' : '']">
            <b-input
              v-model="range.min"
              custom-class="input-sidebar"
              type="number"
              min="0"
              step="any"
              placeholder="MIN"
              data-cy="input-min"
              @focus="isInputFocused"
              @blur="isInputFocused" />
            <img src="/arrow-right.svg" />
            <b-input
              v-model="range.max"
              custom-class="input-sidebar"
              min="0"
              step="any"
              type="number"
              placeholder="MAX"
              data-cy="input-max"
              @focus="isInputFocused"
              @blur="isInputFocused" />
          </div>
          <NeoButton
            data-cy="apply"
            :disabled="!isValidFilter(range.min, range.max)"
            expanded
            @click.native="setPriceRange">
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
  min: fromDecimals(Number(route.query?.min), decimals.value) || undefined,
  max: fromDecimals(Number(route.query?.max), decimals.value) || undefined,
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
  range.value = { min: undefined, max: undefined }
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

const isValidFilter = (
  min: number | undefined,
  max: number | undefined
): boolean => {
  if (min && max) {
    return max > min
  }
  return false
}

const inputFocused = ref(false)

const isInputFocused = (): void => {
  inputFocused.value = !inputFocused.value
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
.input-focused {
  @include ktheme() {
    box-shadow: 0 0 0 1px theme('k-blue');
  }
}
</style>

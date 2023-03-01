<template>
  <b-collapse :open="expanded" animation="slide">
    <template #trigger="{ open }">
      <div class="is-flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">
          {{ $t('offer.status') }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <b-field>
        <NeoCheckbox v-model="listed"> {{ $t('sort.listed') }}</NeoCheckbox>
      </b-field>
      <b-field>
        <NeoCheckbox v-model="owned" :disabled="!accountId">
          {{ $t('sort.own') }}</NeoCheckbox
        >
      </b-field>
    </div>
  </b-collapse>
</template>

<script lang="ts" setup>
import useReplaceUrl from './useReplaceUrl'
import { NeoCheckbox } from '@kodadot1/brick'

const { $store } = useNuxtApp()
const route = useRoute()
const { accountId } = useAuth()
const { replaceUrl: replaceURL } = useReplaceUrl()

type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    expanded?: boolean
    dataModel?: DataModel
  }>(),
  {
    expanded: false,
    dataModel: 'query',
  }
)

const emit = defineEmits(['resetPage'])

const listed =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.listed?.toString() === 'true',
        set: (value) => applyToUrl({ listed: String(value) }),
      })
    : computed({
        get: () => $store.getters['exploreFilters/getListed'],
        set: (value) => $store.dispatch('exploreFilters/setListed', value),
      })

const owned =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.owned?.toString() === 'true',
        set: (value) => applyToUrl({ owned: String(value) }),
      })
    : computed({
        get: () => $store.getters['exploreFilters/getOwned'],
        set: (value) => $store.dispatch('exploreFilters/setOwned', value),
      })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>

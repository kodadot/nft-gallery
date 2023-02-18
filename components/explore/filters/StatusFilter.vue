<template>
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
</template>

<script lang="ts" setup>
import useReplaceUrl from './useReplaceUrl'

const { $store } = useNuxtApp()
const route = useRoute()
const { accountId } = useAuth()
const { replaceUrl: replaceURL } = useReplaceUrl()

const props = defineProps({
  isImmediate: { type: Boolean, default: true },
})

const emit = defineEmits(['resetPage'])

const listed = computed({
  get: () => route.query?.listed?.toString() === 'true',
  set: (value) =>
    props.isImmediate
      ? replaceUrl({ listed: String(value) })
      : $store.dispatch('exploreFilters/setListed', value),
})

const owned = computed({
  get: () => route.query?.owned?.toString() === 'true',
  set: (value) =>
    props.isImmediate
      ? replaceUrl({ owned: String(value) })
      : $store.dispatch('exploreFilters/setOwned', value),
})

const replaceUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>

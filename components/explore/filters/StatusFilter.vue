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
const { $consola } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { accountId } = useAuth()

const emit = defineEmits(['resetPage'])

const listed = computed({
  get: () => route.query?.listed?.toString() === 'true',
  set: (value) => replaceUrl({ listed: String(value) }),
})

const owned = computed({
  get: () => route.query?.owned?.toString() === 'true',
  set: (value) => replaceUrl({ owned: String(value) }),
})

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

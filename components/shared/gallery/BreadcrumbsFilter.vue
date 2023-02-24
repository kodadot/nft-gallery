<template>
  <b-field grouped group-multiline class="filters-tag">
    <template v-for="(value, key) in breads">
      <div v-if="value === 'true'" :key="key" class="control">
        <!-- NeoTag -->
        <NeoTag @close="closeTag(String(key))">
          {{ $i18n.t(`sort.${String(key)}`) }}
        </NeoTag>
      </div>
    </template>
  </b-field>
</template>

<script lang="ts" setup>
import NeoTag from './NeoTag.vue'

const route = useRoute()
const router = useRouter()
const { $i18n, $consola } = useNuxtApp()

const breads = computed(() => route.query)

onMounted(() => {
  if (route.query.listed == undefined) {
    router
      .replace({
        path: String(route.path),
        query: {
          ...route.query,
          page: '1',
          listed: 'true',
        },
      })
      .catch($consola.warn)
  }
})

const closeTag = (key: string) => {
  router
    .replace({
      path: String(route.path),
      query: {
        ...route.query,
        ...{ [key]: false },
        page: '1',
      },
    })
    .catch($consola.warn)
}
</script>

<style lang="scss">
.filters-tag .tag {
  color: initial;
}
</style>

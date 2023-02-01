<template>
  <b-field grouped group-multiline class="filters-tag">
    <template v-for="(value, key) in breads">
      <div v-if="value === 'true'" :key="key" class="control">
        <!-- NeoTag -->
        <b-tag
          attached
          closable
          aria-close-label="clear filter"
          @close="closeTag(String(key))">
          {{ queryMap[key] }}
        </b-tag>
      </div>
    </template>
  </b-field>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()

const queryMap = {
  listed: 'Buy Now',
  owned: 'Own',
}

const breads = computed(() => route.query)

const closeTag = (key: string) => {
  router
    .replace({
      path: String(route.path),
      query: {
        page: '1',
        ...route.query,
        ...{ [key]: false },
        // search: query || undefined,
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

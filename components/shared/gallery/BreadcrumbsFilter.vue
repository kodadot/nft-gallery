<template>
  <b-field grouped group-multiline class="filters-tag">
    <div v-for="(value, key) in breads" :key="key" class="control">
      <b-tag
        v-if="value === 'true'"
        attached
        closable
        aria-close-label="clear filter"
        @close="closeTag(String(key))">
        {{ key }}
      </b-tag>
    </div>
  </b-field>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()

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

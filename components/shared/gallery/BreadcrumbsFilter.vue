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
          {{ queryMapTranslation[String(key)] }}
        </b-tag>
      </div>
    </template>
  </b-field>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { $i18n, $consola } = useNuxtApp()

const breads = computed(() => route.query)

const queryMapTranslation = {
  listed: $i18n.t('sort.listed'),
  owned: $i18n.t('sort.own'),
}

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

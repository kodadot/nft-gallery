<template>
  <a
    v-for="lang in langsFlags"
    :key="lang.value"
    :value="lang.value"
    aria-role="listitem"
    has-link
    class="navbar-item"
    :class="{ 'is-active': $i18n.locale === lang.value }"
    @click="setUserLang(lang.value)"
  >
    <div>{{ lang.flag }} {{ lang.label }}</div>
  </a>
</template>

<script lang="ts" setup>
import { langsFlags, usePreferencesStore } from '@/stores/preferences'

const { $i18n } = useNuxtApp()
const emit = defineEmits(['select'])

const setUserLang = (value: string) => {
  usePreferencesStore().setUserLocale(value)
  emit('select')
}
</script>

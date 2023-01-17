<template>
  <b-dropdown aria-role="list">
    <template #trigger="{ active }">
      <b-button
        type="is-primary is-bordered-light navbar-link-background"
        :label="userFlag"
        :icon-right="active ? 'caret-up' : 'caret-down'" />
    </template>
    <b-dropdown-item
      v-for="lang in langsFlags"
      :key="lang.value"
      aria-role="listitem"
      :value="userLang"
      :class="{ 'is-active': userLang === lang.value }"
      @click="setUserLang(lang.value)">
      {{ lang.flag }}
      {{ lang.label }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { langsFlags as langsFlagsList } from '@/utils/config/i18n'

@Component({})
export default class LocaleChanger extends Vue {
  get langsFlags() {
    return langsFlagsList
  }

  get userFlag(): string {
    return this.$store.getters['lang/getUserFlag']
  }

  get userLang(): string {
    this.$i18n.locale = this.$store.getters['lang/getUserLang']
    return this.$store.getters['lang/getUserLang']
  }

  setUserLang(value: string) {
    this.$store.dispatch('lang/setLanguage', { userLang: value })
    this.$i18n.locale = value
  }
}
</script>

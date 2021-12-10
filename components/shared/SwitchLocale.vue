<template>
  <div class="language-switcher">
    <b-dropdown aria-role="list">
      <template #trigger="{ active }">
        <b-button
          type="is-primary"
          :label="userFlag"
          :icon-right="active ? 'caret-up' : 'caret-down'"
        />
      </template>
      <b-dropdown-item
        aria-role="listitem"
        v-for="lang in langsFlags"
        :key="lang.value"
        :value="userLang"
        :class="{ 'is-active': userLang === lang.value}"
        @click="setUserLang(lang.value)"
      >
        {{ lang.flag }}
        {{ lang.label }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class LocaleChanger extends Vue {

  get langsFlags(): string {
    return this.$store.getters['lang/getLangsFlags']
  }

  get userFlag(): string {
    return this.$store.getters['lang/getUserFlag']
  }

  get userLang(): string {
    this.$i18n.locale = this.$store.getters['lang/getUserLang']
    return this.$store.getters['lang/getUserLang']
  }

  setUserLang(value: string) {
    this.$store.dispatch('lang/setLanguage', { 'userLang': value})
    this.$i18n.locale = value
  }
}
</script>

<style lang="scss" scoped>
  .language-switcher {
    padding-left: 12px;
  }
</style>

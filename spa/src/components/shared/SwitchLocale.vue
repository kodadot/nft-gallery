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
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class LocaleChanger extends Vue {

  get langsFlags() {
    return this.$store.getters.getLangsFlags
  }

  get userFlag() {
    return this.$store.getters.getUserFlag
  }

  get userLang() {
    this.$i18n.locale = this.$store.getters.getUserLang
    return this.$store.getters.getUserLang
  }

  setUserLang(value: string) {
    this.$store.commit('setLanguage', { 'userLang': value})
    this.$i18n.locale = value
  }
}
</script>

<style lang="scss" scoped>
  .language-switcher {
    padding: 0 12px;
  }
</style>

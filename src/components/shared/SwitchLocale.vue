<template>
  <div class="language-switcher">
    <b-dropdown aria-role="list">
      <template #trigger="{ active }">
        <b-button
          type="is-primary"
          :label="userLang"
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
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class LocaleChanger extends Vue {

  get langsFlags() {
    console.log(this.$store.getters.getLangsFlags)
    return this.$store.getters.getLangsFlags
  }

  // get currentFlag() {
  //   return this.$store.getters.getUserFlag
  // }

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

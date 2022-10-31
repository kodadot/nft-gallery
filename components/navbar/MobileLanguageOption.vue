<template>
  <MobileExpandableSection
    :no-padding="true"
    :title="$t('profileMenu.language')"
    icon="globe">
    <b-navbar-item
      v-for="lang in langsFlags"
      :key="lang.value"
      :class="{ 'is-active': userLang === lang.value }"
      :value="userLang"
      aria-role="listitem"
      has-link
      @click="setUserLang(lang.value)">
      <a
        >{{ lang.flag }}
        {{ lang.label }}
      </a>
    </b-navbar-item>
  </MobileExpandableSection>
</template>

<script lang="ts">
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'
import { Component, mixins } from 'nuxt-property-decorator'

@Component({
  components: {
    MobileExpandableSection,
  },
})
export default class MobileLanguageOption extends mixins() {
  get langsFlags(): { value: string; flag: string; label: string }[] {
    return this.$store.getters['lang/getLangsFlags']
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

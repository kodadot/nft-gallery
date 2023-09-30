<template>
  <MobileExpandableSection
    class="mobile-language"
    :no-padding="true"
    :title="$t('profileMenu.language')"
    icon="globe">
    <a
      v-for="lang in langsFlags"
      :key="lang.value"
      :value="lang.value"
      aria-role="listitem"
      has-link
      class="navbar-item"
      :class="{ 'is-active': $i18n.locale === lang.value }"
      @click="setUserLang(lang.value)">
      <div>{{ lang.flag }} {{ lang.label }}</div>
    </a>
  </MobileExpandableSection>
</template>

<script lang="ts" setup>
import { langsFlags } from '@/utils/config/i18n'
import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'

const { $i18n } = useNuxtApp()
const emit = defineEmits(['closeLanguageOption'])

const setUserLang = (value: string) => {
  $i18n.locale.value = value
  emit('closeLanguageOption')
}
</script>

<template>
  <MobileExpandableSection
    class="mobile-language"
    :no-padding="true"
    :title="$t('profileMenu.language')"
    icon="globe">
    <a
      v-for="lang in langsFlags"
      :key="lang.value"
      class="navbar-item"
      :class="{ 'is-active': userLang === lang.value }"
      :value="lang.value"
      aria-role="listitem"
      has-link
      @click="setUserLang(lang.value)">
      <div>{{ lang.flag }} {{ lang.label }}</div>
    </a>
  </MobileExpandableSection>
</template>

<script lang="ts" setup>
import { useLangStore } from '@/stores/lang'
import { langsFlags } from '@/utils/config/i18n'

const MobileExpandableSection = defineAsyncComponent(
  () => import('@/components/navbar/MobileExpandableSection.vue')
)

const { $i18n } = useNuxtApp()
const langStore = useLangStore()
const userLang = computed(() => {
  $i18n.locale = langStore.language.userLang
  return langStore.language.userLang
})

const setUserLang = (value: string) => {
  langStore.setLanguage({ userLang: value })
  $i18n.locale = value
}
</script>

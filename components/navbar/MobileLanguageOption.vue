<template>
  <MobileExpandableSection
    class="mobile-language"
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

<script lang="ts" setup>
import { langsFlags } from '@/utils/config/i18n'
import { useLangStore } from '@/stores/lang'

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

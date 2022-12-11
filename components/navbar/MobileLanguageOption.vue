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
const MobileExpandableSection = defineAsyncComponent(
  () => import('@/components/navbar/MobileExpandableSection.vue')
)

const { $store, $i18n } = useNuxtApp()
const langsFlags = $store.getters['lang/getLangsFlags']

const userLang = computed(() => {
  $i18n.locale = $store.getters['lang/getUserLang']
  return $store.getters['lang/getUserLang']
})

const setUserLang = (value: string) => {
  $store.dispatch('lang/setLanguage', { userLang: value })
  $i18n.locale = value
}
</script>

<style lang="scss" scoped>
.mobile-language {
}
</style>

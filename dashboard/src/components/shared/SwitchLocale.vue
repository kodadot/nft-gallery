<template>
  <div class="language-switcher">
    <b-select
      placeholder="Language"
      v-model="userLang"
    >
      <option
        v-for="(lang, i) in langsFlags"
        :key="`Lang${i}`"
        :value="lang[0]">{{ lang[1] }}
      </option>
    </b-select>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class LocaleChanger extends Vue {

get langsFlags() {
  return this.$store.state.language.langsFlags;
}

get userLang() {
  this.$i18n.locale = this.$store.getters.getUserLang;
  return this.$store.getters.getUserLang;
}

set userLang(value) {
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

<template>
  <!-- v-model="$i18n.locale" -->
  <b-select 
    placeholder="Language"
    icon="language"
    icon-pack="fas"
    v-model="selectedLang"
    @input="selectedLang"
    >
    <option 
      v-for="(lang, i) in langsFlags" 
      :key="`Lang${i}`" 
      :value="lang[0]">{{ lang[1] }}
    </option>
  </b-select>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class LocaleChanger extends Vue {
  // ['cn', '🇨🇳'],
  // ['de', '🇩🇪'],
  // ['ua', '🇺🇦'],
  // ['it', '🇮🇹'],
  // ['hi', '🇮🇳'],
  // ['ko', '🇰🇷'], 

get langsFlags() {  
  return this.$store.state.language.langsFlags;
}

get selectedLang() {
  
  console.log('🚀 ~ file: SwitchLocale.vue ~ line 37 ~ LocaleChanger ~ getselectedLang ~ this.$store.state.language.userlang', 
  this.$store.state.language.userlang);
  // return this.$store.state.language.userlang.value[0] || 'en';
  return 'en'
}

set selectedLang(value) {
  this.$store.commit('setLanguage', { 'userLang': value})
  this.$i18n.locale = value
}
 
public async mounted() {
  this.$store.commit('setLanguage', { 
    // userLang: 'en',
    langsFlags: [
      ['en', '🇬🇧'], 
      ['bn', '🇧🇩'],  
      ['cz', '🇨🇿'],
      ['es', '🇪🇸'],
      ['jp', '🇯🇵'], 
      ['pl', '🇵🇱'],
      ['pt', '🇵🇹'],
      ['tu', '🇹🇷'],
      ['ur', '🇵🇰'],
      ['vt', '🇻🇳'],
      ['fr', '🇫🇷'],
      ['ru', '🇷🇺'],
      ['fr', '🇫🇷'],
      ['sk', '🇸🇰'],
      ['nl', '🇳🇱']
    ]}
  )
}
  
}
</script>

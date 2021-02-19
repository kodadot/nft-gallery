<template>
  <b-select 
    placeholder="Language"
    icon="language"
    icon-pack="fas"
    v-model="$i18n.locale">
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
  public langsFlags: any = [
    ['en', '🇬🇧'], 
    ['bn', '🇧🇩'],
    // ['cn', '🇨🇳'],
    ['cz', '🇨🇿'],
    // ['de', '🇩🇪'],
    ['es', '🇪🇸'],
    // ['it', '🇮🇹'],
    // ['hi', '🇮🇳'],
    // ['ko', '🇰🇷'], 
    ['jp', '🇯🇵'], 
    ['pl', '🇵🇱'],
    ['pt', '🇵🇹'],
    ['tu', '🇹🇷'],
    ['ur', '🇵🇰'],
    ['vt', '🇻🇳'],
    // ['ua', '🇺🇦'],
    // ['fr', '🇫🇷'],
    ['ru', '🇷🇺'],
  ]
}
</script>

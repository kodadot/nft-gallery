<template>
  <b-select 
    placeholder="Language"
    icon="language"
    icon-pack="fas"
    v-model="$i18n.locale">
    <option 
      v-for="(lang, i) in langs" 
      :key="`Lang${i}`" 
      :value="lang">{{ lang }}
    </option>
  </b-select>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class LocaleChanger extends Vue {
  public langs: any = ['En', 'Ko']
}
</script>

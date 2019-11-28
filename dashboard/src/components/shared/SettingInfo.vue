<template>
  <div class="setting-info__wrapper">
    <div><b>Setting Info:</b></div>
    <div v-for="el in selected" :key="el[0]">
      <span class="setting-info__label">{{ el[0] }}</span>
      <span>{{ el[1] }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SettingInfo extends Vue {


  get selected() {
    console.log(this.$store.getters.getSettings);
    return Object.entries(this.$store.getters.getSettings);
  }


}
</script>

<style scoped>
/* If you want it on bottom ;D */
.setting-info__wrapper {
  color: white;
  padding-top: 1em;
  /* position: fixed;
  bottom: 1em; */
}

.setting-info__label {
  font-weight: bold;
}

.setting-info__label::after {
  content: ": ";
}
</style>
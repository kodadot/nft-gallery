<template>
<div id="AccountsCreate">
  <Create 
    mode="accounts"
    :theme="theme"
  />
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Create from '../components/shared/Create.vue';

@Component({
  components: {
    Create,
  },
})
export default class AccountsCreate extends Vue {
  public theme: string = 'substrate';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }
}
</script>
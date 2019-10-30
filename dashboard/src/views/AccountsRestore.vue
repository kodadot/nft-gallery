<template>
<div id="AccountsRestore">
  <div> 
    <Restore />
  </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Restore from '../components/shared/Restore.vue';

@Component({
  components: {
    Restore,
  },
})
export default class AccountsRestore extends Vue {
  public theme: string = 'substrate';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public mounted(): void {
    this.getIconTheme();
  }
}
</script>
<template>
<div id="AccountsRestore">
  <div>
    <Restore @on-restore="$emit('on-restore')"/>
  </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Restore from '@/components/shared/accounts/Restore.vue';

@Component({
  components: {
    Restore
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

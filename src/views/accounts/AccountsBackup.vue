<template>
<div id="AccountsBackup">
  <div>
    <Backup
      :address="address"
      :theme="theme"
    />
  </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Backup from '@/components/shared/accounts/Backup.vue';

@Component({
  components: {
    Backup
  },
})
export default class AccountsBackup extends Vue {
  public theme: string = 'substrate';
  public address: string = '';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }
  public externalURI() {
    if (this.$route.params.address) {
      this.address = this.$route.params.address;
    }
  }

  public mounted(): void {
    this.getIconTheme();
    this.externalURI();
  }
}
</script>

<template>
<ModalView>
<div id="AccountsChangepass">
  <Changepass
    :address="address"
    :theme="theme"
  />
</div>
</ModalView>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Changepass from '../components/shared/accounts/ChangePassword.vue';
import ModalView from '@/components/shared/modals/ModalView.vue';
@Component({
  components: {
    Changepass,
    ModalView,
  },
})
export default class AccountsCreate extends Vue {
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
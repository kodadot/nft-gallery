<template>
<ModalView>
<div id="AccountsCreate">
  <Create 
    mode="accounts"
    :theme="theme"
    @on-create="$emit('on-create')"
  />
</div>
</ModalView>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Create from '../components/shared/Create.vue';
import ModalView from '@/components/shared/modals/ModalView.vue';

@Component({
  components: {
    ModalView,
    Create,
  },
})
export default class AccountsCreate extends Vue {
  public theme: string = 'substrate';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public mounted(): void {
    this.getIconTheme();
  }
}
</script>
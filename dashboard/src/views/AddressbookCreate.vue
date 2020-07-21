<template>
<ModalView>
<div id="AddressbookCreate">
  <Create 
    mode="addressbook"
    :theme="theme"
    @on-create="$emit('on-create')"
  />
</div>
</ModalView>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Create from '../components/shared/accounts/Create.vue';
import ModalView from '@/components/shared/modals/ModalView.vue';

@Component({
  components: {
    Create,
    ModalView,
  },
})

export default class AddressbookCreate extends Vue {
  public theme: string = 'substrate';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public mounted(): void {
    this.getIconTheme();
  }
}
</script>
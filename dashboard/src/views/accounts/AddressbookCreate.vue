<template>
<div id="AddressbookCreate">
  <Create 
    mode="addressbook"
    :theme="theme"
    @on-create="$emit('on-create')"
  />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Create from '@/components/shared/accounts/Create.vue';

@Component({
  components: {
    Create
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
<template>
<div id="AddressbookCreate">
  <Create 
    mode="addressbook"
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
export default class AddressbookCreate extends Vue {
  public theme: string = 'substrate';

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }
}
</script>
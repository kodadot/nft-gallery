<template>
  <div id="Backup">
      <button>Backup</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Keypair extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public password!: string;
}
</script>

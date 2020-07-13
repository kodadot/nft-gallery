<template>
  <div>RegistrarInfo Works!</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
   name: 'RegistrarInfo',
})
export default class RegistrarInfo extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any[];

  public mounted() {
  

    
  }
}
</script>

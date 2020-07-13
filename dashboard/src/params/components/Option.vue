<template>
  <div>Option works!</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Option extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any[];

  public mounted() {
  console.log("Option -> mounted -> argument", this.argument)
  console.log("Option -> mounted -> defaultValue", this.defaultValue)

    
  }
}
</script>

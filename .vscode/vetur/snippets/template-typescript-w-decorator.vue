<template>
  <div>


  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class  extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>

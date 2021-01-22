<template>
  <b-image
    :src="require('@/utils/placeholder.png')"
    alt="Simple image"
    ratio="1by1"
    rounded
  ></b-image>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class Unknown extends Vue {
  private value2: any;
  @Prop() public value!: any;
}
</script>

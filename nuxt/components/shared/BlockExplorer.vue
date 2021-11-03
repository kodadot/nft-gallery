<template>
  <div>
    <b-button>View </b-button>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'


@Component({})
export default class  extends Vue {

  @Prop() public value!: any;
}
</script>

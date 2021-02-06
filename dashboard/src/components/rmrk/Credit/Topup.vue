<template>
  <div>
    <b-input v-model="userAddress"></b-input>


  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Credit extends Vue {

  public userAddress: string = '';
}
</script>

<template>
  <b-switch v-model="model"
    :rounded="false">
    {{ value ? 'I\'m helping to cover costs' : 'I don\'t want to support' }}
  </b-switch>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component({})
export default class Support extends Vue {
  @Prop() public value!: boolean;

  get model() {
    return this.value
  }


  set model(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

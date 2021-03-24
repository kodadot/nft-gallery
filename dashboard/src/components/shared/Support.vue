<template>
  <b-switch v-model="model"
    :rounded="false">
    {{ value ? `I\'m helping to cover costs ($ ${rounded})` : 'I don\'t want to support' }}
  </b-switch>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { round } from '@/utils/support'


@Component({})
export default class Support extends Vue {
  @Prop() public value!: boolean;
  @Prop({ default: 0 }) public price!: number;

  get rounded() {
    return round(this.price)
  }

  get model() {
    return this.value
  }


  set model(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

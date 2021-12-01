<template>
  <b-switch
    v-model="model"
    :type="type"
    :rounded="false"
  >
    <div class="is-flex is-align-items-center">
      <span class="mr-2">
        {{ value ? `${activeMessage} ($ ${rounded})` : `${passiveMessage}` }}
      </span>
      <slot name="tooltip" />
    </div>
  </b-switch>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { round } from '@/utils/support'


@Component({})
export default class Support extends Vue {
  @Prop() public value!: boolean;
  @Prop({ default: 0 }) public price!: number;
  @Prop({ default: 'I\'m helping to cover costs' }) public activeMessage!: string;
  @Prop({ default: 'I don\'t want to support' }) public passiveMessage!: string;
  @Prop({ default: '' }) public type!: string;

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

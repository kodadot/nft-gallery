<template>
    <b-field :label="label" :expanded="expanded">
      <b-input :value="value" disabled ></b-input>
    </b-field>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class DisabledInput extends Vue {
  @Prop() public label!: any;
  @Prop() public value!: any;
  @Prop({default: false}) public expanded!: boolean;
}
</script>

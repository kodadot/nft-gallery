<template>
  <b-field :label="label" :expanded="expanded">
    <b-input :value="value" :readonly="readonly" disabled></b-input>
  </b-field>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class DisabledInput extends Vue {
  @Prop({ type: String, required: true }) public label!: string;
  @Prop({ type: String, required: true }) public value!: string;
  @Prop({ type: Boolean, default: false }) public expanded!: boolean;
  @Prop({ type: Boolean, default: false }) public readonly!: boolean;
}
</script>

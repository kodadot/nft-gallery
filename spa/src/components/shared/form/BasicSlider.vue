<template>
  <b-field class="mt-4" :label="$t(label)" label-position="">
    <b-slider v-model="vValue" :min="min" :max="max" :ticks="ticks" :lazy="lazy" />
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, VModel, Vue } from 'vue-property-decorator'

@Component
export default class BasicSwitch extends Vue {
  @VModel({ type: Number, required: true }) vValue!: number;
  @Prop({ type: String, required: true }) label!: string;
  @Prop({ type: Number, default: 0 }) min!: number;
  @Prop({ type: Number, default: 100 }) max!: number;
  @Prop(Boolean) ticks!: boolean;
  @Prop(Boolean) lazy!: boolean;
}
</script>

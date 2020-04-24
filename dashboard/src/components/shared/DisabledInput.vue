<template>
    <b-field :label="label">
      <b-input :value="value" disabled></b-input>
    </b-field>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class DisabledInput extends Vue {
  @Prop() public label!: any;
  @Prop() public value!: any;
}
</script>

<template>
  <b-progress :value="value" :max="max" size="is-medium" type="is-primary" show-value>
    {{value}} / {{max}}
  </b-progress>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop() public value: any;
  @Prop() public max: any;
  // @Prop() public label!: string;

}
</script>

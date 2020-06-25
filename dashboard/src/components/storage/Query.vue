<template>
  <div>
    Query: {{ value.label }}
    {{ stringify }}
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';


@Component
export default class Query extends Vue {
  @Prop() public value!: any;

  get stringify() {
    return this.value && this.value.value.toHuman();
  }

}
</script>

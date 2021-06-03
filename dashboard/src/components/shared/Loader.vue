<template>
    <b-loading is-full-page v-model="isLoading" :can-cancel="true">
      <div class="loading-icon" ><span v-if="status" class="loading-text">{{ $t(status) }}</span></div>
    </b-loading>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Loader extends Vue {
  @Prop(String) public status!: string;
  @Prop(Boolean) public value!: boolean;

  get isLoading() {
    return this.value;
  }

  set isLoading(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style scoped>
.loading-text {
    position: relative;
    top: 4em;
}
</style>

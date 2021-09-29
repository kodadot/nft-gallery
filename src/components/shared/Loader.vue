<template>
  <b-loading is-full-page v-model="isLoading" :can-cancel="true">
    <figure>
      <img class="loading-icon" :src="placeholder" />
      <figcaption v-if="status" class="loading-text">{{ $t(status) }}</figcaption>
    </figure>
  </b-loading>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Loader extends Vue {
  @Prop(String) public status!: string;
  @Prop(Boolean) public value!: boolean;

  protected placeholder = '/infinity.svg';

  get isLoading() {
    return this.value
  }

  set isLoading(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style scoped>
.loading-text {
  position: relative;
  max-width: 200px;
  text-align: center;
}
</style>

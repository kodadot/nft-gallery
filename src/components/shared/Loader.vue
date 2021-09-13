<template>
  <b-loading is-full-page v-model="isLoading" :can-cancel="true">
    <figure>
      <img class="loading-icon" :src="placeholder" />
      <figcaption v-if="status" class="loading-text">{{ translation }}</figcaption>
    </figure>
  </b-loading>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Values } from 'vue-i18n';

type TranslationWithArg = [string, Values];

@Component({})
export default class Loader extends Vue {
  @Prop() public status!: string | TranslationWithArg;
  @Prop(Boolean) public value!: boolean;

  protected placeholder = '/infinity.svg';

  get translation() {
    return typeof this.status === 'string' ? this.$t(this.status) : this.$t(...this.status);
  }

  get isLoading() {
    return this.value;
  }

  set isLoading(value: boolean) {
    this.$emit('input', value);
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

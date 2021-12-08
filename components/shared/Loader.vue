<template>
  <b-loading
    v-model="isLoading"
    is-full-page
    :can-cancel="true"
  >
    <div class="loading-container">
      <p class="funfact-text">
        <span class="text-bold funcfact-heading">{{ randomFunFactHeading }}</span>
        <br/>
        {{ randomFunFactQuestion }}
      </p>
      <figure>
        <img
          class="loading-icon"
          :src="placeholder"
        >
        <figcaption
          v-if="status"
          class="loading-text"
        >
          {{ $t(status) }}
        </figcaption>
      </figure>
    </div>
  </b-loading>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { randomIntegerInRange } from '@/utils/calculation'
import i18n from '@/i18n'

@Component({})
export default class Loader extends Vue {
  @Prop(String) public status!: string;
  @Prop(Boolean) public value!: boolean;

  protected placeholder = '/infinity.svg';

  protected randomNumber = randomIntegerInRange(1, 33)

  get randomFunFactHeading() {
    return i18n.t(`funfacts.${this.randomNumber}.heading`)
  }

  get randomFunFactQuestion() {
    return i18n.t(`funfacts.${this.randomNumber}.question`)
  }

  get isLoading() {
    return this.value
  }

  set isLoading(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style scoped>
.loading-container {
  text-align: center;
}
.funfact-text{
  position: relative;
  color: white;
  margin-bottom: .5rem;
  max-width: 450px;
}
.funcfact-heading {
  color: #d32e79;
  font-size: 1.2rem;
  line-height: 2.5rem;
}
.loading-text {
  position: relative;
  max-width: 200px;
  text-align: center;
}
</style>

<template>
  <b-loading v-model="isLoading" is-full-page :can-cancel="canCancel">
    <div class="loading-container">
      <div
        v-if="randomFunFactHeading && randomFunFactQuestion"
        class="funfact-text">
        <div class="has-text-weight-bold funcfact-heading">
          {{ randomFunFactHeading }}
        </div>
        <br />
        <div class="pl-4 pr-4">
          <b-icon
            size="is-large"
            icon="lightbulb"
            class="has-text-primary-light" />
          <div class="question">{{ randomFunFactQuestion }}</div>
        </div>
      </div>
      <figure>
        <img class="loading-icon" :src="placeholder" />
        <figcaption v-if="status" class="loading-text">
          {{ $t(status) }}
        </figcaption>
        <div v-if="status" class="mt-3 mb-3 has-text-primary">
          {{ $t('helper.signStuckText') }}
        </div>
      </figure>
    </div>
  </b-loading>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { randomIntegerBetween } from '@/utils/calculation'

@Component({})
export default class Loader extends Vue {
  @Prop(String) public status!: string
  @Prop(Boolean) public value!: boolean
  @Prop({ type: Boolean, default: true }) public canCancel

  // seed new funfact each time loader is used
  @Watch('value')
  private handleLoadingStateChange(newValue) {
    if (newValue) {
      let newRandomNumber = this.randomNumber
      // make sure same quote isn't fetched again
      while (newRandomNumber === this.randomNumber) {
        newRandomNumber = randomIntegerBetween(1, 35)
      }
      this.randomNumber = newRandomNumber
    }
  }

  protected placeholder = '/preloader.svg'

  protected randomNumber = randomIntegerBetween(1, 35)

  public interval

  get randomFunFactHeading() {
    return this.$t(`funfacts.${this.randomNumber}.heading`)
  }

  get randomFunFactQuestion() {
    return this.$t(`funfacts.${this.randomNumber}.question`)
  }

  get isLoading() {
    return this.value
  }

  set isLoading(value: boolean) {
    this.$emit('input', value)
  }

  public created(): void {
    setInterval(() => {
      this.interval = this.randomNumber = randomIntegerBetween(1, 35)
    }, 8000)
  }

  public beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.loading-container {
  text-align: center;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
  margin: 0rem 1rem;
  width: 450px;
  border: 2px solid $primary-light;
  box-shadow: $dropdown-content-shadow;
}
.funfact-text {
  position: relative;
  color: white;
  max-width: 450px;
}
.funcfact-heading {
  color: $primary-light;
  font-size: 1.2rem;
  line-height: 2.5rem;
  border-bottom: 1px solid #fff;
  padding: 0.5rem 1rem;
}
.question {
  min-height: 70px;
}
.loading-text {
  position: relative;
  max-width: 200px;
  text-align: center;
  margin: 0 auto;
}
</style>

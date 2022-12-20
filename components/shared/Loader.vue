<template>
  <b-loading v-model="isLoading" is-full-page :can-cancel="canCancel">
    <div class="loading-container">
      <figure>
        <img class="loading-icon" :src="placeholder" />
        <figcaption v-if="status" class="loading-text">
          {{ $t(status) }}
        </figcaption>
        <div v-if="status" class="mt-3 mb-3 has-text-primary">
          {{ $t('helper.signStuckText') }}
        </div>
      </figure>
      <div
        v-if="randomFunFactHeading && randomFunFactQuestion"
        class="funfact-text">
        <div class="funfact-heading">
          {{ randomFunFactHeading }}
        </div>
        <div>
          <div class="question">{{ randomFunFactQuestion }}</div>
        </div>
      </div>
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
  padding: 24px 16px;
  background: $white;
  backdrop-filter: $frosted-glass-backdrop-filter;
  margin: 0rem 1rem;
  width: 300px;
  min-height: 350px;
  border: 1px solid $black;
  box-shadow: $primary-shadow;
}

.funfact-heading {
  color: $black;
  font-size: 20px;
  line-height: 2.5rem;
}
.question {
  min-height: 70px;
  font-size: 16px;
}

.loading-text {
  position: relative;
  max-width: 200px;
  text-align: center;
  margin: 0 auto;
}

.loading-icon {
  border-bottom: 1px solid $shade;
}
</style>

<template>
  <b-loading v-model="isLoading" is-full-page :can-cancel="true">
    <div class="loading-container">
      <div
        v-if="randomFunFactHeading && randomFunFactQuestion"
        class="funfact-text">
        <div class="text-bold funcfact-heading">{{ randomFunFactHeading }}</div>
        <br />
        <div class="pl-4 pr-4">
          <b-icon size="is-large" icon="lightbulb" class="funfact-icon" />
          <div class="question">{{ randomFunFactQuestion }}</div>
        </div>
      </div>
      <figure>
        <img class="loading-icon" :src="placeholder" />
        <figcaption v-if="status" class="loading-text">
          {{ $t(status) }}
        </figcaption>
      </figure>
    </div>
  </b-loading>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { randomIntegerBetween } from '@/utils/calculation'
import i18n from '@/utils/config/i18n'

@Component({})
export default class Loader extends Vue {
  @Prop(String) public status!: string
  @Prop(Boolean) public value!: boolean

  // seed new funfact each time loader is used
  @Watch('value')
  private handleLoadingStateChange(newValue) {
    if (newValue) {
      let newRandomNumber = this.randomNumber
      // make sure same quote isn't fetched again
      while (newRandomNumber === this.randomNumber) {
        newRandomNumber = randomIntegerBetween(1, 33)
      }
      this.randomNumber = newRandomNumber
    }
  }

  protected placeholder = '/infinity.svg'

  protected randomNumber = randomIntegerBetween(1, 33)

  public interval

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

  public created(): void {
    setInterval(() => {
      this.interval = this.randomNumber = randomIntegerBetween(1, 33)
    }, 8000)
  }

  public beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.loading-container {
  text-align: center;
  background: #1a1a1ae0;
  margin: 0rem 1rem;
  width: 450px;
  border: 2px solid $primary-light;
  box-shadow: $dropdown-content-shadow;
}
.funfact-text {
  position: relative;
  color: white;
  margin-bottom: 0.5rem;
  max-width: 450px;
}
.funcfact-heading {
  color: $primary-light;
  font-size: 1.2rem;
  line-height: 2.5rem;
  border-bottom: 1px solid #fff;
  padding: 0.5rem 1rem;
}
.funfact-icon {
  color: $primary-light;
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

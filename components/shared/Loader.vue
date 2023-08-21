<template>
  <NeoLoading :active.sync="isLoading" is-full-page :can-cancel="canCancel">
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
  </NeoLoading>
</template>

<script lang="ts" setup>
import { randomIntegerBetween } from '@/utils/calculation'
import { NeoLoading } from '@kodadot1/brick'

const emit = defineEmits(['input'])
const props = withDefaults(
  defineProps<{
    status: string
    value: boolean
    canCancel?: boolean
  }>(),
  {
    canCancel: true,
  }
)

const { $i18n } = useNuxtApp()
const placeholder = '/preloader.svg'
const randomNumber = ref(randomIntegerBetween(1, 35))
const interval = ref()

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      let newRandomNumber = randomNumber.value
      // make sure same quote isn't fetched again
      while (newRandomNumber === randomNumber.value) {
        newRandomNumber = randomIntegerBetween(1, 35)
      }
      randomNumber.value = newRandomNumber
    }
  }
)

const randomFunFactHeading = computed(() =>
  $i18n.t(`funfacts.${randomNumber.value}.heading`)
)
const randomFunFactQuestion = computed(() =>
  $i18n.t(`funfacts.${randomNumber.value}.question`)
)
const isLoading = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

onMounted(() => {
  interval.value = setInterval(() => {
    randomNumber.value = randomIntegerBetween(1, 35)
  }, 8000)
})

onBeforeMount(() => {
  clearInterval(interval.value)
})
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

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    border: 1px solid theme('border-color');
    background: theme('background-color');
  }
}

.funfact-heading {
  font-size: 20px;
  line-height: 2.5rem;
  @include ktheme() {
    color: theme('text-color');
  }
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
  @include ktheme() {
    border-bottom: 1px solid theme('k-shade');
  }
}
</style>

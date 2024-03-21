<template>
  <NeoLoading v-model:active="isLoading" is-full-page :can-cancel="canCancel">
    <div
      class="backdrop-blur-[20px] w-[300px] min-h-[350px] mx-4 my-0 px-4 py-6 bg-background-color border border-border-color shadow-primary">
      <figure>
        <img class="border-b border-k-shade" :src="placeholder" />
        <figcaption
          v-if="status"
          class="max-w-[200px] mx-auto my-0 text-center relative">
          {{ $t(status) }}
        </figcaption>
        <div v-if="!status" class="mt-3 mb-3 text-k-primary">
          {{ $t('helper.signStuckText') }}
        </div>
      </figure>
      <div
        v-if="randomFunFactHeading && randomFunFactQuestion"
        class="funfact-text">
        <div class="text-xl leading-10 text-text-color">
          {{ randomFunFactHeading }}
        </div>
        <div>
          <div class="min-h-[70px] text-base">{{ randomFunFactQuestion }}</div>
        </div>
      </div>
    </div>
  </NeoLoading>
</template>

<script lang="ts" setup>
import { randomIntegerBetween } from '@/utils/calculation'
import { NeoLoading } from '@kodadot1/brick'
import { TransactionStatus } from '@/composables/useTransactionStatus'

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
  defineProps<{
    status: TransactionStatus
    modelValue?: boolean
    canCancel?: boolean
  }>(),
  {
    status: TransactionStatus.Unknown,
    modelValue: false,
    canCancel: true,
  },
)

const { $i18n } = useNuxtApp()
const placeholder = '/preloader.svg'
const randomNumber = ref(randomIntegerBetween(1, 35))
const interval = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      let newRandomNumber = randomNumber.value
      // make sure same quote isn't fetched again
      while (newRandomNumber === randomNumber.value) {
        newRandomNumber = randomIntegerBetween(1, 35)
      }
      randomNumber.value = newRandomNumber
    }
  },
)

const randomFunFactHeading = computed(() =>
  $i18n.t(`funfacts.${randomNumber.value}.heading`),
)
const randomFunFactQuestion = computed(() =>
  $i18n.t(`funfacts.${randomNumber.value}.question`),
)
const isLoading = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
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

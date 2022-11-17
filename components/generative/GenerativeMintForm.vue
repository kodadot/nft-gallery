<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-3">Mint your sub0 POAP</p>

    <BasicInput
      v-model="name"
      required
      :label="$t('mint.nft.name.label')"
      :message="$t('mint.nft.name.message')"
      :placeholder="$t('mint.nft.name.placeholder')"
      expanded
      spellcheck="true"
      data-cy="input-name" />

    <SubmitButton
      icon="plus"
      label="generate"
      :loading="isLoading"
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
import { PredictionStatus, getPrediction, predict } from '@/services/replicate'
import { emptyObject } from '~~/utils/empty'

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)
const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const name = ref('')
const isLoading = ref(false)
const status = ref('')
const predictionId = ref('')
const predicion = ref<PredictionStatus>(emptyObject<PredictionStatus>())
const emit = defineEmits(['select'])

const submit = async () => {
  isLoading.value = true
  status.value = 'predicting'

  const predictRequest = await predict(name.value)

  const timeout = setInterval(async () => {
    const generation = await getPrediction(predictRequest.id)
    console.log('status', status)
    predicion.value = generation
    status.value = generation.status
    if (generation.status === 'failed' || generation.status === 'succeeded') {
      isLoading.value = false
      status.value = ''
      clearInterval(timeout)
      if (generation.status === 'succeeded') {
        emit('select', generation)
      }
    }
  }, 2500)

  predictionId.value = predictRequest.id
}
</script>

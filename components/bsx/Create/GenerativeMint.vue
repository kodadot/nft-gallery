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

    <!-- <BasicInput
      v-model="description"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      class="mb-0 mt-5"
      :label="$t('mint.nft.description.label')"
      :message="$t('mint.nft.description.message')"
      :placeholder="$t('mint.nft.description.placeholder')"
      data-cy="input-description" /> -->

    <SubmitButton
      v-if="!submitPressed"
      label="generate"
      :loading="isLoading"
      @click="submit" />
    <div v-else>
      <ImageGrid
        :images="predicion.output"
        :disabled="selectedImage"
        @update="handleSelectImage" />
    </div>
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

const ImageGrid = defineAsyncComponent(
  () => import('@/components/shared/view/ImageGrid.vue')
)

const name = ref('')
const isLoading = ref(false)
const status = ref('')
const predictionId = ref('')
const submitPressed = ref(false)
const predicion = ref<PredictionStatus>(emptyObject<PredictionStatus>())
const selectedImage = ref('')

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

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
      submitPressed.value = true
      isLoading.value = false
      status.value = ''
      clearInterval(timeout)
    }
  }, 2000)

  predictionId.value = predictRequest.id
}
</script>

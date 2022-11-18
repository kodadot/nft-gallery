<template>
  <b-steps
    v-model="currentStep"
    :rounded="false"
    mobile-mode="minimalist"
    :has-navigation="false">
    <b-step-item step="1" label="Mint" :clickable="isStepsClickable">
      <GenerativeMint @select="handlePrediction" />
    </b-step-item>

    <b-step-item step="2" label="Select" :clickable="isStepsClickable">
      <ImageSelectGrid
        :predicion="predicion"
        :selected="image"
        @select="handleImageSelect" />
    </b-step-item>

    <b-step-item step="3" label="Contact" :clickable="isStepsClickable">
      <ContactForm @select="handleMailSubmit" />
    </b-step-item>

    <b-step-item
      step="4"
      label="Finish"
      :clickable="isStepsClickable"
      :type="{ 'is-success': true }">
      <CongratsView @select="clearAll" />
    </b-step-item>
  </b-steps>
</template>

<script setup lang="ts">
import { PredictionStatus } from '@/services/replicate'
import { emptyObject } from '@/utils/empty'

const GenerativeMint = defineAsyncComponent(
  () => import('@/components/generative/GenerativeMintForm.vue')
)

const ImageSelectGrid = defineAsyncComponent(
  () => import('@/components/generative/ImageSelectGrid.vue')
)

const ContactForm = defineAsyncComponent(
  () => import('@/components/generative/ContactForm.vue')
)

const CongratsView = defineAsyncComponent(
  () => import('@/components/generative/CongratsView.vue')
)

const isStepsClickable = ref(true)
const currentStep = ref<number>(0)
const predicion = ref<PredictionStatus>(emptyObject<PredictionStatus>())
const image = ref<string>('')
const email = ref('')

const handlePrediction = (generation: PredictionStatus) => {
  predicion.value = generation
  goToStep(1)
}

const handleImageSelect = (imageURI: string) => {
  image.value = imageURI
  goToStep(2)
}

const handleMailSubmit = (mail: string) => {
  email.value = mail
  submitAll()
  goToStep(3)
}

const submitAll = () => {
  console.log('submitAll', predicion.value, image.value, email.value)
}

const clearAll = () => {
  predicion.value = emptyObject<PredictionStatus>()
  image.value = ''
  email.value = ''
  goToStep(1)
}

const goToStep = (step: number) => {
  currentStep.value = step
}
</script>

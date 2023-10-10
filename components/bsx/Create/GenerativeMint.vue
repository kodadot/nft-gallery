<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoSteps
      v-model="currentStep"
      rounded
      mobile-mode="minimalist"
      :has-navigation="false">
      <hr />

      <NeoStepItem
        step="1"
        icon="check"
        label="Generate"
        :clickable="isStepsClickable">
        <GenerativeMint @select="handlePrediction" @submit="handleBuilder" />
      </NeoStepItem>

      <NeoStepItem
        step="2"
        icon="check"
        label="Select"
        :clickable="isStepsClickable">
        <ImageSelectGrid
          :predicion="predicion"
          :selected="image"
          @select="handleImageSelect" />
      </NeoStepItem>

      <NeoStepItem
        step="3"
        icon="check"
        label="Contact"
        :clickable="isStepsClickable">
        <ContactForm @select="handleMailSubmit" />
      </NeoStepItem>

      <NeoStepItem
        step="4"
        icon="check"
        label="Finish"
        :clickable="isStepsClickable"
        :type="{ 'is-success': true }">
        <CongratsView @select="clearAll" />
      </NeoStepItem>
    </NeoSteps>
  </div>
</template>

<script setup lang="ts">
import { NeoStepItem, NeoSteps } from '@kodadot1/brick'
import { PredictionStatus } from '@/services/replicate'
import { doWaifu } from '@/services/waifu'
import { emptyObject } from '@/utils/empty'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  CAMPAIGN,
  Options,
  buildMetadata,
} from '@/components/generative/promptBuilder'

const GenerativeMint = defineAsyncComponent(
  () => import('@/components/generative/GenerativeMintForm.vue'),
)

const ImageSelectGrid = defineAsyncComponent(
  () => import('@/components/generative/ImageSelectGrid.vue'),
)

const ContactForm = defineAsyncComponent(
  () => import('@/components/generative/ContactForm.vue'),
)

const CongratsView = defineAsyncComponent(
  () => import('@/components/generative/CongratsView.vue'),
)

const isStepsClickable = ref(false)
const currentStep = ref<number>(1)
const predicion = ref<PredictionStatus>(emptyObject<PredictionStatus>())
const builder = ref<Options>(emptyObject<Options>())
const image = ref<string>('')
const email = ref('')
const isLoading = ref(false)
const status = ref('')

const handlePrediction = (generation: PredictionStatus) => {
  predicion.value = generation
  goToStep(2)
}

const handleImageSelect = (imageURI: string) => {
  image.value = imageURI
  goToStep(3)
}

const handleMailSubmit = (mail: string) => {
  email.value = mail
  submitAll()
  goToStep(4)
}

const handleBuilder = (options: Options) => {
  builder.value = options
}

const submitAll = async () => {
  try {
    isLoading.value = true
    status.value = 'loader.ipfs'
    const metadata = await buildMetadata(
      image.value,
      builder.value,
      predicion.value,
    )
    status.value = 'loader.generative.send'
    await doWaifu(
      {
        address: email.value,
        metadata,
        image: image.value,
      },
      CAMPAIGN,
    )
    goToStep(4)
  } catch (error) {
    showNotification(
      'Error: ' + (error as Error).message,
      notificationTypes.warn,
    )
  } finally {
    isLoading.value = false
    status.value = ''
  }
  console.log('submitAll', predicion.value, image.value, email.value)
}

const clearAll = () => {
  predicion.value = emptyObject<PredictionStatus>()
  image.value = ''
  email.value = ''
  goToStep(0)
}

const goToStep = (step: number) => {
  currentStep.value = step
}
</script>

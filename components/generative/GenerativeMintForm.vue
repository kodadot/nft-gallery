<template>
  <section>
    <Loader v-model="isLoading" :status="status" />

    <p class="title is-size-4 capitalize">I want to be</p>
    <RadioSelect v-model="form.gender" :options="gender" rounded multiline />

    <p class="title is-size-4 capitalize">on</p>
    <RadioSelect v-model="form.art" :options="art" rounded separated />

    <p class="title is-size-4 capitalize">by method</p>
    <RadioSelect
      v-model="form.style"
      :options="isPhoto ? filmTypes : styles"
      separated
      rounded
      show-empty />

    <p class="title is-size-4 capitalize">displaying</p>
    <RadioSelect
      v-model="form.framing"
      :options="framing"
      separated
      show-empty
      rounded />

    <p class="title is-size-4 capitalize">having</p>
    <RadioSelect
      v-model="form.having"
      :options="accessories"
      separated
      show-empty
      rounded />

    <p class="title is-size-4 capitalize">wearing</p>
    <RadioSelect
      v-model="form.wearing"
      :options="clothes"
      separated
      show-empty
      rounded />

    <p class="title is-size-4 capitalize">in light</p>
    <RadioSelect
      v-model="form.lighting"
      :options="lights"
      separated
      rounded
      show-empty />

    <!-- <p class="title is-size-4 capitalize">art inspired by</p>
    <RadioSelect
      v-model="form.inspiredBy"
      :options="inspiredBy"
      separated
      rounded
      show-empty /> -->

    <SubmitButton
      size="medium"
      icon="arrows-spin"
      label="Generate Image"
      :loading="isLoading"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
import { PredictionStatus, getPrediction, predict } from '@/services/replicate'
import { emptyObject } from '@/utils/empty'
import {
  accessories,
  art,
  clothes,
  filmTypes,
  framing,
  gender,
  lights,
  styles,
} from './options'
import { Options, buildPrompt } from './promptBuilder'

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue'),
)

const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue'),
)

const RadioSelect = defineAsyncComponent(
  () => import('@/components/shared/form/RadioSelect.vue'),
)

const form = reactive<Options>({
  gender: 'waifu',
  art: 'painting',
  vibe: '',
  framing: 'close-up',
  filmType: '',
  style: '',
  inspiredBy: '',
  having: '',
  wearing: '',
  lighting: '',
})

const { $consola } = useNuxtApp()
const isLoading = ref(false)
const status = ref('')
const predictionId = ref('')
const predicion = ref<PredictionStatus>(emptyObject<PredictionStatus>())
const emit = defineEmits(['select', 'submit'])
const isPhoto = computed(() => form.art === 'photo')

// change form.style when form.art changes
watch(isPhoto, () => (form.style = ''))

const submit = async () => {
  isLoading.value = true
  status.value = 'predicting'
  const prompt = buildPrompt(form)
  $consola.log('prompt', prompt)
  const predictRequest = await predict(prompt)
  emit('submit', form)

  const timeout = setInterval(async () => {
    const generation = await getPrediction(predictRequest.id)
    $consola.log('status', status.value)
    predicion.value = generation
    status.value = 'loader.generative.' + generation.status
    if (generation.status === 'failed' || generation.status === 'succeeded') {
      isLoading.value = false
      status.value = ''
      clearInterval(timeout)
      if (generation.status === 'succeeded') {
        emit('select', generation)
        // logPrediction(predictRequest.id, prompt).catch(console.error)
      }
    }
  }, 2500)

  predictionId.value = predictRequest.id
}
</script>

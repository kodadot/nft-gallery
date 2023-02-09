<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-3">Mint your {{ NAME }} waifu</p>

    <p class="title is-size-4">I want to be</p>
    <RadioSelect v-model="form.gender" :options="gender" />

    <p class="title is-size-5">on</p>
    <RadioSelect v-model="form.art" :options="art" />

    <p class="title is-size-5">using</p>
    <RadioSelect
      v-model="form.style"
      :options="isPhoto ? filmTypes : styles"
      separated
      show-empty />

    <p class="title is-size-5">displaying</p>
    <RadioSelect
      v-model="form.framing"
      :options="framing"
      separated
      show-empty />

    <p class="title is-size-5">having</p>
    <RadioSelect
      v-model="form.having"
      :options="accessories"
      separated
      show-empty />

    <p class="title is-size-5">wearing</p>
    <RadioSelect
      v-model="form.wearing"
      :options="clothes"
      separated
      show-empty />

    <p class="title is-size-5">in light</p>
    <RadioSelect
      v-model="form.lighting"
      :options="lights"
      separated
      show-empty />

    <p class="title is-size-5">art inspired by</p>
    <RadioSelect
      v-model="form.inspiredBy"
      :options="inspirations"
      separated
      show-empty />

    <SubmitButton
      icon="plus"
      label="generate"
      :loading="isLoading"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
import { PredictionStatus, getPrediction, predict } from '@/services/replicate'
import { logPrediction } from '@/services/supabase'
import { emptyObject } from '@/utils/empty'
import {
  accessories,
  art,
  clothes,
  filmTypes,
  framing,
  gender,
  inspirations,
  inspiredBy,
  lights,
  styles,
} from './options'
import { NAME, Options, buildPrompt } from './promptBuilder'

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)
// const BasicInput = defineAsyncComponent(
//   () => import('@/components/shared/form/BasicInput.vue')
// )
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const RadioSelect = defineAsyncComponent(
  () => import('@/components/shared/input/selectable/RadioSelect.vue')
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
  console.log('prompt', prompt)
  const predictRequest = await predict(prompt)
  emit('submit', form)

  const timeout = setInterval(async () => {
    const generation = await getPrediction(predictRequest.id)
    console.log('status', status)
    predicion.value = generation
    status.value = 'loader.generative.' + generation.status
    if (generation.status === 'failed' || generation.status === 'succeeded') {
      isLoading.value = false
      status.value = ''
      clearInterval(timeout)
      if (generation.status === 'succeeded') {
        emit('select', generation)
        logPrediction(predictRequest.id, prompt).catch(console.error)
      }
    }
  }, 2500)

  predictionId.value = predictRequest.id
}
</script>

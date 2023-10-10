<template>
  <div ref="wavesurferWrapper" />
</template>

<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js'

const emit = defineEmits(['play', 'ready'])
const props = defineProps<{
  getMedia: () => Ref<HTMLAudioElement>
}>()

const { isDarkMode } = useTheme()
const wavesurfer = ref<WaveSurfer>()
const wavesurferWrapper = ref()

const colors = {
  light: {
    waveColor: '#999999', // k-grey
    progressColor: '#000000', // black
  },
  dark: {
    waveColor: '#cccccc', // k-grey
    progressColor: '#ffffff', // white
  },
}

const initWaveform = (media: any) => {
  wavesurfer.value = WaveSurfer.create({
    container: wavesurferWrapper.value,
    height: 33,
    barWidth: 1,
    cursorWidth: 0,
    media: media,
    ...getWaveformColors(),
  })

  wavesurfer.value.on('interaction', () => emit('play'))
  wavesurfer.value.on('ready', () => emit('ready'))
}

const getWaveformColors = () => {
  return isDarkMode.value ? colors.dark : colors.light
}

watch(isDarkMode, () => {
  const newColors = getWaveformColors()

  wavesurfer.value?.setOptions(newColors)
})

onMounted(() => {
  initWaveform(props.getMedia())
})
</script>

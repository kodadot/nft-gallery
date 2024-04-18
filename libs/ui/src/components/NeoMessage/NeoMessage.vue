<template>
  <transition name="fade">
    <article
      v-show="isActive"
      ref="wrapper"
      class="message !px-6 !py-4 shadow-primary border border-border-color relative"
      :class="[`message__${variant}`]">
      <div class="flex gap-4">
        <div v-if="computedIcon">
          <NeoIcon :icon="computedIcon" size="large" both />
        </div>

        <div class="w-full flex justify-between">
          <div>
            <header>
              <slot name="header">
                <p class="text-[1rem] leading-[1.75rem] text-text-color">
                  {{ title }}
                </p>
              </slot>
            </header>

            <section v-if="$slots.default">
              <slot />
            </section>
          </div>

          <NeoButton
            v-if="closable"
            variant="icon"
            icon="xmark"
            no-shadow
            class="!bg-[unset] text-[16px]"
            @click="close" />
        </div>
      </div>

      <div
        class="w-full h-1 message-progress absolute left-0 bottom-0 transition-all ease-linear"
        :style="{ width: `${percent}%` }" />
    </article>
  </transition>
</template>

<script lang="ts" setup>
import { useElementHover } from '@vueuse/core'
import NeoButton from '../NeoButton/NeoButton.vue'
import NeoIcon from '../NeoIcon/NeoIcon.vue'
import { NeoMessageVariant } from '../../types'

const iconVariant: Record<NeoMessageVariant, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'circle-exclamation',
  danger: 'circle-exclamation',
}

const emit = defineEmits(['close', 'update:active', 'click'])
const props = withDefaults(
  defineProps<{
    active: boolean
    title?: string
    message: string
    closable: boolean
    variant: NeoMessageVariant
    autoClose: boolean
    duration: number
  }>(),
  {
    active: true,
    closable: true,
    autoClose: false,
    duration: 2000,
  },
)

const wrapper = ref()
const isHovering = useElementHover(wrapper)

const timer = ref()
const isActive = ref(props.active)
const remainingTime = ref(props.duration)

const computedIcon = computed(() => iconVariant[props.variant] ?? null)

const percent = computed(() => {
  return (remainingTime.value / props.duration) * 100
})

const close = () => {
  isActive.value = false
  remainingTime.value = 0
  emit('close')
  emit('update:active', false)
}

watch(isActive, (active) => {
  if (active) {
    startTimer()
  } else if (timer.value) {
    clearTimeout(timer.value)
  }
})

const startTimer = () => {
  timer.value = setInterval(trackProgress, 100)
}

const trackProgress = () => {
  if (remainingTime.value > 0 && !isHovering.value) {
    remainingTime.value -= 100
  }
}

watch(remainingTime, (time) => {
  if (time === 0 && props.autoClose) {
    close()
  }
})

watch(
  () => props.active,
  (active) => (isActive.value = active),
)

onMounted(startTimer)
onUnmounted(() => clearTimeout(timer.value))
</script>

<style lang="scss" scoped>
@import './NeoMessage.scss';
</style>

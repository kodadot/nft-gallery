<template>
  <transition name="fade">
    <article
      v-show="isActive"
      ref="wrapper"
      class="message !px-6 !py-4 shadow-primary border border-border-color relative md:min-w-[350px]"
      :class="[`message__${variant}`]">
      <div class="flex gap-4">
        <div v-if="computedIcon">
          <NeoIcon :icon="iconName" size="large" :spin="iconSpin" />
        </div>

        <div class="w-full flex justify-between">
          <div>
            <header>
              <slot name="header">
                <p class="text-[1rem] leading-[1.2rem] text-text-color mb-2">
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
            class="!bg-[unset] text-[16px] p-1"
            @click="close" />
        </div>
      </div>

      <div
        v-if="showProgressBar"
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

type CustomIconVariant = { icon: string; spin: boolean }
type IconVariant = string | CustomIconVariant

const iconVariant: Record<NeoMessageVariant, IconVariant> = {
  info: 'circle-info',
  success: 'check',
  warning: 'circle-exclamation',
  danger: 'circle-exclamation',
  neutral: 'circle-info',
}

const emit = defineEmits(['close', 'update:active', 'click'])
const props = withDefaults(
  defineProps<{
    title?: string
    active: boolean
    closable: boolean
    variant: NeoMessageVariant
    autoClose: boolean
    duration: number
    showProgressBar: boolean
    icon?: IconVariant
    holdTimer?: boolean
  }>(),
  {
    active: true,
    closable: true,
    autoClose: false,
    duration: 2000,
    showProgressBar: false,
    variant: 'success',
    title: '',
    icon: undefined,
    holdTimer: false,
  },
)

const wrapper = ref()
const isHovering = useElementHover(wrapper)

const timer = ref()
const isActive = ref(props.active)
const remainingTime = ref(props.duration)

const computedIcon = computed(
  () => props.icon ?? iconVariant[props.variant] ?? null,
)
const iconName = computed(
  () => (computedIcon.value as CustomIconVariant)?.icon ?? computedIcon.value,
)
const iconSpin = computed(() => (computedIcon.value as CustomIconVariant).spin)

const percent = computed(() => {
  return (remainingTime.value / props.duration) * 100
})

const close = () => {
  isActive.value = false
  remainingTime.value = 0
  emit('close')
  emit('update:active', false)
}

watch([isActive, () => props.holdTimer], ([active, holdTimer]) => {
  if (active && !holdTimer) {
    startTimer()
  } else if (timer.value) {
    clearTimeout(timer.value)
  }
})

const timerTime = computed(() => (props.showProgressBar ? 100 : 1000))

const startTimer = () => {
  timer.value = setInterval(trackProgress, timerTime.value)
}

const trackProgress = () => {
  if (remainingTime.value > 0 && !isHovering.value && props.showProgressBar) {
    remainingTime.value -= timerTime.value
  }
}

watch(remainingTime, (time) => {
  if (time <= 0 && props.autoClose) {
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

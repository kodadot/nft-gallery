<template>
  <transition name="fade">
    <NeoUpload
      v-model="selectedFile"
      drag-drop
      native
      expanded
      class="hover-color"
      :accept="accept"
      @update:model-value="onFileSelected"
    >
      <div class="text-center flex justify-center p-5">
        <div
          v-if="!selectedFile"
          class="flex flex-col limit-width"
        >
          <slot name="title">
            <span class="mb-4 text-left">{{ title }}</span>
          </slot>
          <NeoIcon
            :icon="icon"
            class="icon-size text-k-grey py-3"
            custom-size="fa-2x"
            pack="fass"
          />
          <p class="text-k-grey mt-8">
            {{ subtitle }}
          </p>
        </div>
        <img
          v-else-if="loading"
          src="~/assets/svg/preloader.svg"
          width="200"
        >
        <div
          v-else
          class="flex items-center"
        >
          <div class="flex flex-col justify-between items-center">
            <KIcon
              name="i-mdi:check-circle-outline"
              class="check-icon text-k-green"
              size="3x"
            />
            <div class="flex items-center mt-6 flex-col">
              <span class="text-k-grey mr-5 mb-4">
                {{ selectedFile?.name }} {{ $t('uploaded') }}
              </span>
              <span class="text-k-grey mr-5">
                {{ subtitle }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </NeoUpload>
  </transition>
</template>

<script setup lang="ts">
import { NeoIcon, NeoUpload } from '@kodadot1/brick'

const { $i18n } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    accept: string
    title?: string
    icon?: string
    subtitle?: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    accept: '',
    title: '',
    icon: 'cloud-arrow-up',
    subtitle: undefined,
    disabled: false,
  },
)

const selectedFile = ref<File | null>(null)
const emit = defineEmits(['fileSelected'])
const subtitle = computed(() => props.subtitle || $i18n.t('dropUpload'))

watch(selectedFile, (newFile, oldFile) => {
  if (!newFile && oldFile) {
    selectedFile.value = oldFile
  }
})

const onFileSelected = (file: File) => {
  if (file) {
    selectedFile.value = file
    emit('fileSelected', file)
  }
}
</script>

<style lang="scss" scoped>
.icon-size {
  font-size: 3.5rem;
}

.check-icon {
  font-size: 2.5rem;
}

.limit-width {
  max-width: 25rem;
}
.hover-color:deep(.o-upl__draggable--hovered) {
  background-color: var(--k-primary-light);
}
</style>

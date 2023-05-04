<template>
  <o-upload
    v-model="selectedFile"
    drag-drop
    native
    expanded
    class="hover-color"
    :accept="accept"
    @input="onFileSelected">
    <div class="has-text-centered is-flex is-justify-content-center p-5">
      <div
        v-if="!selectedFile"
        class="is-flex is-flex-direction-column limit-width">
        <slot name="title">
          <span class="mb-4 has-text-left">{{ title }}</span>
        </slot>
        <NeoIcon
          :icon="icon"
          class="icon-size has-text-grey py-3"
          size="large"
          icon-pack="fas" />
        <p class="has-text-grey mt-8">
          {{ subtitle }}
        </p>
      </div>
      <transition v-else-if="loading" name="fade">
        <img src="/preloader.svg" width="200" />
      </transition>
      <div v-else class="is-flex is-align-items-center">
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between">
          <NeoIcon icon="circle-check" class="check-icon has-text-k-green" />
          <div
            class="is-flex is-align-items-center mt-6 is-flex-direction-column">
            <span class="has-text-grey mr-5 mb-4">
              {{ selectedFile?.name }} {{ $t('uploaded') }}
            </span>
            <span class="has-text-grey mr-5">
              {{ subtitle }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </o-upload>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { OUpload } from '@oruga-ui/oruga'
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
  }
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
@import '@/styles/abstracts/variables';

.icon-size {
  font-size: 3.5rem;
}

.check-icon {
  font-size: 2.5rem;
}

.limit-width {
  max-width: 25rem;
}
.hover-color:deep .o-upl__draggable--hovered {
  @include ktheme() {
    background-color: theme('k-primaryLight');
  }
}
</style>

<template>
  <div
    v-if="url"
    class="flex gap-2"
  >
    <img
      :src="url"
      alt="logo field"
      class="h-[100px] aspect-square border border-border-color object-cover"
    >

    <div
      class="flex flex-col justify-between"
    >
      <p class="text-xs capitalize">
        {{ $t('edit.collection.image.message') }}
      </p>

      <div class="flex flex-col gap-2">
        <p class="text-xs text-k-grey capitalize">
          {{ $t('edit.collection.image.hint') }}
        </p>

        <OverrideFile
          @clear="() => {
            file = undefined
            url = undefined
          }"
          @select="value => file = value"
        />
      </div>
    </div>
  </div>

  <DropUpload
    v-else
    v-model="file"
    required
    expanded
    preview
    :label="$t('edit.collection.drop')"
  />
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const emit = defineEmits(['update:file', 'update:url'])
const props = defineProps<{
  // title: string
  file: File | undefined
  url: string | undefined
}>()

const file = useVModel(props, 'file', emit)
const url = useVModel(props, 'url', emit)

watch(file, (file) => {
  if (file) {
    url.value = URL.createObjectURL(file)
  }
})

watch(() => props.url), (value) => {
  if (value) {
    url.value = value
  }
}, { immediate: true }
</script>

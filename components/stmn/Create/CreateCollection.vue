<template>
  <div>
    <h2 class="title is-size-3">
      {{ $t('mint.collection.create') }}
    </h2>
    <form class="w-full">
      <NeoField :label="$t('mint.collection.logo.label')" class="w-full mb-4">
        <MetadataUpload
          ref="collectionImage"
          v-model="logo"
          required
          :label="$t('mint.collection.logo.message')"
          expanded
          preview
          accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg" />
      </NeoField>
      <NeoField :label="$t('mint.collection.banner.label')" class="w-full mb-4">
        <MetadataUpload
          ref="collectionImage"
          v-model="image"
          required
          :label="$t('mint.collection.drop')"
          expanded
          preview
          accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg" />
      </NeoField>
      <NeoField
        :label="$t('mint.collection.name.label')"
        class="w-full mb-4 placholder-color"
        :error="!name">
        <NeoInput
          v-model="name"
          required
          :placeholder="'*' + $t('massmint.required')" />
      </NeoField>
      <NeoField
        :label="$t('mint.collection.description.label')"
        class="w-full mb-4">
        <NeoInput
          v-model="description"
          type="textarea"
          has-counter
          maxlength="500"
          height="10rem" />
      </NeoField>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput } from '@kodadot1/brick'

import DragDrop from '@/components/shared/DragDrop.vue'

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)

const MetadataUpload = defineAsyncComponent(
  () => import('@/components/rmrk/Create/DropUpload.vue')
)

const name = ref('')
const description = ref('')
const logo = ref<File | null>(null)
const image = ref<File | null>(null)
const loading = ref(false)
</script>

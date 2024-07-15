<template>
  <NeoField :label="$t('Tags')" :addons="false">
    <NeoInputitems
      id="search_tag"
      v-model="tags"
      :data="allTags"
      :maxitems="max"
      :placeholder="placeholder"
      variant="info"
      item-class="my-3"
      :autocomplete-classes="{
        'item-class': 'p-2',
        inputClasses: {
          inputClass: 'neo-input',
        },
      }"
      aria-close-label="Delete this tag"
      icon="tag"
      open-on-focus
      has-counter
      allow-new
      allow-autocomplete
      expanded
      @update:modelValue="handleInput">
      <template #header>
        <b>{{ $t('general.tagsAdd') }}</b>
      </template>
    </NeoInputitems>
  </NeoField>
</template>

<script setup lang="ts">
import { NeoField, NeoInputitems } from '@kodadot1/brick'

const allTags = ref(['audio', 'video', 'image', 'music', 'abstract'])

const props = withDefaults(
  defineProps<{
    max?: number
    placeholder?: string
    simple?: boolean
  }>(),
  {
    max: 3,
    placeholder: 'Select tags or create your own',
  },
)

const tags = computed({
  get: () => [],
  set: (value) => handleInput(value),
})

// @Emit('input')
const handleInput = (value) =>
  props.simple ? value : value.map((v) => ({ value: v }))
</script>

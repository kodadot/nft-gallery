<template>
  <section>
    <br />
    <p class="title is-size-3">Waii you made it! ✨</p>
    <p class="title is-size-4">Our interns will process it soon!</p>
    <b-image
      src="https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/4a50ce48-9cbc-4f58-c6a9-755968205500/aaa" />
    <br />

    <SubmitButton
      icon="sync"
      type="is-success"
      label="Start over"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const emit = defineEmits(['select'])

const submit = () => {
  emit('select')
}
</script>

<template>
  <section>
    <br />
    <p class="title is-size-3">Waii you made it! ✨</p>
    <p class="title is-size-4">Our interns will process it soon!</p>
    <img src="https://pbs.twimg.com/media/FhZZxxwXwAAkvKI?format=jpg" />

    <SubmitButton label="Start over" @click="submit" />
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

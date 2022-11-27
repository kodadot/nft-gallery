<template>
  <section>
    <br />
    <p class="title is-size-3">Enter your email</p>

    <BasicInput
      v-model="email"
      required
      :label="$t('mint.nft.email.label')"
      :message="$t('mint.nft.email.message')"
      :placeholder="$t('mint.nft.email.placeholder')"
      expanded
      type="email"
      spellcheck="true"
      data-cy="input-name" />

    <SubmitButton
      label="submit"
      type="is-info"
      icon="envelope"
      expanded
      @click="submit" />
  </section>
</template>

<script setup lang="ts">
const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const email = ref('')
const emit = defineEmits(['select'])

const submit = async () => {
  emit('select', email.value)
}
</script>

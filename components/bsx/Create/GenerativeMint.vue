<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-3">
      <!-- {{ $t('mint.context') }} -->
      Mint your sub0 POAP
    </p>

    <BasicInput
      v-model="name"
      required
      :label="$t('mint.nft.name.label')"
      :message="$t('mint.nft.name.message')"
      :placeholder="$t('mint.nft.name.placeholder')"
      expanded
      spellcheck="true"
      data-cy="input-name" />

    <BasicInput
      v-model="description"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      class="mb-0 mt-5"
      :label="$t('mint.nft.description.label')"
      :message="$t('mint.nft.description.message')"
      :placeholder="$t('mint.nft.description.placeholder')"
      data-cy="input-description" />

    <SubmitButton label="generate" :loading="isLoading" @click="submit" />
  </section>
</template>

<script setup lang="ts">
const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)
const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const name = ref('')
const description = ref('')
const isLoading = ref(false)
const status = ref('')

const submit = async () => {
  isLoading.value = true
  status.value = 'Creating collection'

  isLoading.value = false
  status.value = ''
}
</script>

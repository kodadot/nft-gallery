<template>
  <div>
    <Loader v-model="isLoading" :status="status" />

    <h2 class="title is-size-3">
      {{ $t('mint.collection.create') }}
    </h2>
    <form class="w-full" @submit.prevent>
      <NeoField>
        <Auth />
      </NeoField>
      <NeoField :label="$t('mint.collection.logo.label')" class="w-full mb-4">
        <MetadataUpload
          ref="collectionImage"
          v-model="logo"
          required
          :label="$t('mint.collection.drop')"
          expanded
          preview
          accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg" />
      </NeoField>

      <NeoField
        :label="$t('mint.collection.name.label')"
        :message="$t('mint.collection.name.message')"
        required
        class="w-full mb-4 placholder-color"
        :error="!name">
        <NeoInput
          v-model="name"
          required
          :placeholder="'*' + $t('massmint.required')" />
      </NeoField>
      <NeoField>
        <NeoSwitch v-model="unlimited">{{ $t('mint.unlimited') }} </NeoSwitch>
      </NeoField>
      <NeoField
        v-if="!unlimited"
        class="mt-1"
        :label="$t('Maximum NFTs in collection')">
        <NeoInput
          v-model="max"
          type="number"
          placeholder="1 is the minimum"
          :min="1" />
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

      <NeoField v-if="isLogIn">
        <SubmitButton
          expanded
          label="create collection"
          :loading="isLoading"
          :disabled="isMintDisabled"
          @click="submit" />
        <span v-if="isMintDisabled" class="is-size-7 has-text-k-red">
          Balance is not enough
        </span>
      </NeoField>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput, NeoSwitch } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import { notificationTypes, showNotification } from '@/utils/notification'
import { CollectionToMintStatmine } from '@/composables/transaction/types'
import SubmitButton from '@/components/base/SubmitButton.vue'

const MetadataUpload = defineAsyncComponent(
  () => import('@/components/rmrk/Create/DropUpload.vue')
)

const isLoading = ref(false)
const status = ref('')
const max = ref(1)
const unlimited = ref(true)
const name = ref('')
const description = ref('')
const logo = ref<File | null>(null)

const { balance, isLogIn } = useAuth()

const isMintDisabled = computed(() => Number(balance.value) <= 2)

const emit = defineEmits(['navigateToCreateNftTab'])

const formIsValid = computed(() => {
  if (!name.value) {
    return false
  }
  if (!logo.value) {
    return false
  }
  if (max.value < 1 && !unlimited.value) {
    return false
  }
  return true
})

const submit = async () => {
  if (!formIsValid.value || isMintDisabled.value) {
    return
  }

  isLoading.value = true
  status.value = 'loader.ipfs'

  const {
    transaction,
    status: txStatus,
    isLoading: txIsLoading,
    blockNumber,
  } = useTransaction()

  watch([txIsLoading, txStatus], () => {
    isLoading.value = txIsLoading.value
    if (Boolean(txStatus.value)) {
      status.value = txStatus.value
    }
  })

  watch(blockNumber, (block) => {
    if (block) {
      emit('navigateToCreateNftTab')
    }
  })

  showNotification(`Creating collection ${name.value}`, notificationTypes.info)

  try {
    const collection: CollectionToMintStatmine = {
      description: description.value,
      name: name.value,
      nftCount: unlimited.value ? 0 : max.value,
      file: logo.value,
    }
    transaction({
      interaction: Interaction.MINT,
      urlPrefix: usePrefix().urlPrefix.value,
      collection,
    })
  } catch (e) {
    showNotification(`[ERR] ${e}`, notificationTypes.warn)
    console.error(e)
    isLoading.value = false
  }
}
</script>

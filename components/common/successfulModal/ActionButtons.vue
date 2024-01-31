<template>
  <div class="flex">
    <NeoButton
      class="border-k-grey hover-button w-full"
      rounded
      no-shadow
      @click="viewNft"
      >{{ $t('drops.viewNft') }}</NeoButton
    >

    <NeoButton
      class="hover-button w-full ml-4"
      :class="{ border: canListNft }"
      :disabled="cantList"
      :loading="cantList"
      variant="k-accent"
      rounded
      no-shadow
      loading-with-label
      @click="listNft"
      >{{ cantList ? $t('loading') : $t('drops.listNft') }}</NeoButton
    >
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['list'])
const props = defineProps<{
  id: string
  canListNft: boolean
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { urlPrefix } = usePrefix()

const nftPath = computed(() => `/${urlPrefix.value}/gallery/${props.id}`)

const nftFullUrl = computed(() => `${window.location.origin}${nftPath.value}`)

const cantList = computed(() => !props.canListNft)

const viewNft = () => {
  window.open(nftFullUrl.value, '_blank')
}

const listNft = () => {
  emit('list')
}

watch(
  () => props.canListNft,
  (canListNft) => {
    if (canListNft) {
      toast($i18n.t('drops.canList'))
    }
  },
)
</script>

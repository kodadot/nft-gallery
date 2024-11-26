<template>
  <NeoDropdownItem
    @click="refresh"
  >
    {{ $t('moreActions.refereshCollectionMetdata') }}
  </NeoDropdownItem>
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import { refreshOdaCollectionTokensMetadata } from '@/services/oda'

const route = useRoute()
const { toast } = useToast()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()

const refresh = async () => {
  toast($i18n.t('toast.refreshMetdata'))
  refreshOdaCollectionTokensMetadata(urlPrefix.value, route.params.id.toString())
}
</script>

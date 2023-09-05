<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <div>
      <NeoButton
        v-if="isBasilisk"
        v-safe-href="`/${urlPrefix}/assets`"
        no-shadow
        rounded
        tag="a"
        icon="arrow-right-long">
        Portfolio View
      </NeoButton>
    </div>

    <a class="has-text-grey is-size-7" @click="addFunds"
      >+ {{ $t('addFunds') }}</a
    >
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { showNotification } from '@/utils/notification'

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const { accountId } = useAuth()
const { init: initTransak } = useTransak()
const { $i18n } = useNuxtApp()

const addFunds = () => {
  initTransak({
    address: accountId.value,
    onSuccess: () => {
      showNotification($i18n.t('general.successfullyAddedFunds'))
    },
  })
}
</script>

<style scoped></style>

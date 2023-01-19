<template>
  <div>
    <a class="identity-name has-text-weight-bold" :href="explorerLink">
      {{ shortenedAddress }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { getExplorer } from '~/components/rmrk/Profile/utils'
type Address = string | GenericAccountId | undefined

const props = defineProps<{
  shortenedAddress?: string | object
  address?: Address
}>()

const { urlPrefix } = usePrefix()

const explorerLink = computed(() => {
  return getExplorer(urlPrefix.value, String(props.address))
})
</script>

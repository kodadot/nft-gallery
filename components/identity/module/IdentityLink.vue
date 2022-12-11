<template>
  <div>
    <a :href="`https://kusama.subscan.io/account/${address}`">
      {{ shortenedAddress }}
    </a>
    <a v-clipboard:copy="address" @click="toast('Copied to clipboard')">
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.79167 9.74992V1.08325H10.8333V9.74992H3.79167ZM4.875 8.66658H9.75V2.16659H4.875V8.66658ZM1.625 11.9166V3.24992H2.70833V10.8333H8.66667V11.9166H1.625ZM4.875 8.66658V2.16659V8.66658Z"
          fill="#6188E7" /></svg
    ></a>
  </div>
</template>

<script lang="ts" setup>
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
type Address = string | GenericAccountId | undefined

const { $buefy } = useNuxtApp()

const toast = (message: string) => {
  $buefy.toast.open({
    message,
    type: 'is-neo',
  })
}

defineProps<{
  shortenedAddress?: string | object
  address?: Address
}>()
</script>

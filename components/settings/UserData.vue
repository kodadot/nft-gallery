<template>
  <NeoButton @click="openModal">{{
    $t('profileMenu.configureCookies')
  }}</NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const { openModal } = useCookies()
</script>

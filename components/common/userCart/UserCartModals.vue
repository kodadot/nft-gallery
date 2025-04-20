<template>
  <ItemTransferModal />
  <ItemBurnModal v-if="burnVisible(urlPrefix)" />
</template>

<script lang="ts" setup>
import { burnVisible } from '@/utils/config/permission.config'

const { urlPrefix } = usePrefix()
</script>

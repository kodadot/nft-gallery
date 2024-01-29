<template>
  <IdentityPopoverHeader />
  <IdentityPopoverFooter :nfts="nftEntities" />
</template>

<script lang="ts" setup>
import { useIdentitySoldData } from '../utils/useIdentity'

import IdentityPopoverHeader from './IdentityPopoverHeader.vue'
import IdentityPopoverFooter from './IdentityPopoverFooter.vue'

const address = inject('address')

const { nftEntities } = useIdentitySoldData({ address })
</script>

<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div class="is-flex is-justify-content-space-between">
      <div>&nbsp;</div>
      <GalleryItemActionSlides ref="actionRef" :active="active">
        <template #action>
          <NeoButton
            label="Transfer"
            size="large"
            fixed-width
            no-shadow
            @click.native="sendItem" />
        </template>

        <template #content>
          <div>
            <input v-model="address" type="text" placeholder="Transfer To:" />
          </div>
        </template>
      </GalleryItemActionSlides>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { NeoButton } from '@kodadot1/brick'
import { Interaction, createInteraction } from '@kodadot1/minimark'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { ss58Of } from '@/utils/config/chain.config'
import correctFormat from '@/utils/ss58Format'
import { tokenIdToRoute } from '@/components/unique/utils'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

const { urlPrefix } = usePrefix()
const { apiInstance } = useApi()
const { accountId } = useAuth()
const { $route } = useNuxtApp()
const { howAboutToExecute, isLoading, status } = useMetaTransaction()

const props = defineProps<{
  nftId: string
}>()

const active = ref(false)
const address = ref()

const cb = ref()
const arg = ref()

async function sendItem() {
  if (active.value === false) {
    active.value = true
  } else {
    const api = await apiInstance.value
    const { id, item } = tokenIdToRoute($route.params.id)
    const [, err] = checkAddress(
      address.value,
      correctFormat(ss58Of(urlPrefix.value))
    )

    if (!isAddress(address.value)) {
      dangerMessage('Invalid address')
      return
    }

    if (err) {
      dangerMessage(err)
      return
    }

    switch (urlPrefix.value) {
      case 'rmrk':
        cb.value = api.tx.system.remark
        arg.value = [
          createInteraction(
            Interaction.BUY,
            '1.0.0',
            props.nftId,
            String(address.value)
          ),
        ]
        break

      case 'bsx':
      case 'snek':
        cb.value = api.tx.utility.batchAll
        arg.value = [
          [
            api.tx.marketplace.setPrice(id, item, 0),
            api.tx.nft.transfer(id, item, address.value),
          ],
        ]
        break

      default:
        break
    }

    howAboutToExecute(accountId.value, cb.value, arg.value, () => {
      infoMessage('Item transfered')
    })
  }
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped></style>

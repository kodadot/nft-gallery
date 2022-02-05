<template>
  <div class="nft-appreciation__main is-flex">
    <Loader v-model="isLoading" :status="status" />
    <IndexerGuard>
      <b-button
        v-if="accountId"
        class="nft-appreciation__button"
        icon-left="heart"
        @click="handleClick" />
      <VEmojiPicker
        v-show="showDialog"
        label-search="Search your emote"
        class="emote-picker"
        @select="onSelectEmoji" />
    </IndexerGuard>
    <EmotionList
      class="emote-list"
      :emotions="emotions"
      @selected="mapToEmoji" />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '@/utils/notification'
import groupBy from '@/utils/groupBy'
import EmotionList from './EmotionList.vue'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { VEmojiPicker } from 'v-emoji-picker'
import emojiUnicode from 'emoji-unicode'
import NFTUtils from '../service/NftUtils'
import { Emoji, IEmoji } from 'v-emoji-picker/lib/models/Emoji'
import { Emote } from '../service/scheme'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { createInteraction, Interaction } from '@kodadot1/minimark'

@Component({
  components: {
    EmotionList,
    VEmojiPicker,
    Loader: () => import('@/components/shared/Loader.vue'),
    IndexerGuard: () => import('@/components/shared/wrapper/IndexerGuard.vue'),
  },
})
export default class Appreciation extends mixins(
  MetaTransactionMixin,
  RmrkVersionMixin
) {
  @Prop({ type: Array }) public emotes!: Emote[]
  @Prop({ type: String }) public currentOwnerId!: string
  @Prop({ type: String }) public accountId!: string
  @Prop({ type: String }) public nftId!: string
  @Prop(Boolean) public burned!: boolean
  @Prop(Boolean) public simple!: boolean // submit heart directly

  protected showDialog = false

  protected handleClick() {
    if (this.simple) {
      showNotification('[EMOTE] Sending ♥️')
      return this.submit('2764') // heart emoji
    } else {
      this.showDialog = !this.showDialog
    }
  }

  protected async onSelectEmoji(emoji: IEmoji) {
    const { version, nftId } = this
    const emote = emojiUnicode(emoji.data).split(' ')[0].toUpperCase()
    if (emote) {
      showNotification(`[EMOTE] Selected ${emoji.data} or ${emote}`)
      const rmrk = createInteraction(Interaction.EMOTE, version, nftId, emote)
      await this.submit(rmrk)
    } else {
      showNotification('[EMOTE] Unable to emote', notificationTypes.warn)
    }
  }

  private mapToEmoji(key: string) {
    const emoji: Emoji = {
      data: String.fromCodePoint(parseInt(key, 16)),
      category: '',
      aliases: [],
    }
    this.onSelectEmoji(emoji)
  }

  get emotions(): Record<string, string | number> {
    this.emotes?.map(
      (e, index) => (this.emotes[index].value = e.value.toUpperCase())
    )
    return groupBy(this.emotes || [], 'value')
  }

  private async submit(rmrk: string) {
    const { api } = Connector.getInstance()

    try {
      const cb = api.tx.system.remark
      const args = [rmrk]
      this.initTransactionLoader()
      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[EMOTE] Saved in ${blockNumber}`,
          notificationTypes.success
        )
      })
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.emote-picker {
  position: absolute;
  left: 50px;
  z-index: 1;
}

.emoji-picker {
  --ep-color-bg: #000 !important;
  --ep-color-border: #db2980 !important;
  --ep-color-sbg: #000 !important;
  --ep-color-active: #db2980 !important;
  border-width: $button-border-width !important;
  border-radius: 0 !important;
}

.nft-appreciation__column {
  padding: 0.45em;
}

.nft-appreciation__wrapper:hover {
  cursor: pointer;
  background-color: #dedddd;
}

.nft-appreciation__button {
  border-radius: 0;
  border: 0;
  border-top: 2px solid $primary !important;
  color: $primary;
  margin-right: 15px;
}
</style>

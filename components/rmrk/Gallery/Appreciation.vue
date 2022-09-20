<template>
  <div class="nft-appreciation__main is-flex">
    <Loader v-model="isLoading" :status="status" />
    <b-button
      v-if="accountId"
      class="nft-appreciation__button"
      icon-left="heart"
      @click="toggleEmojiDialog" />
    <VEmojiPicker
      v-show="showDialog"
      label-search="Search your emote"
      class="emote-picker"
      @select="onSelectEmoji" />
    <EmotionList
      class="emote-list"
      :emotions="emotions"
      @selected="mapToEmoji" />
  </div>
</template>

<script lang="ts">
import groupBy from '@/utils/groupBy'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Interaction, createInteraction } from '@kodadot1/minimark'
import emojiUnicode from 'emoji-unicode'
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { VEmojiPicker } from 'v-emoji-picker'
import { Emoji, IEmoji } from 'v-emoji-picker/lib/models/Emoji'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { Emote } from '../service/scheme'
import EmotionList from './EmotionList.vue'

@Component({
  components: {
    EmotionList,
    VEmojiPicker,
    Loader: () => import('@/components/shared/Loader.vue'),
  },
})
export default class Appreciation extends mixins(
  MetaTransactionMixin,
  RmrkVersionMixin,
  UseApiMixin
) {
  @Prop({ type: Array }) public emotes!: Emote[]
  @Prop({ type: String }) public currentOwnerId!: string
  @Prop({ type: String }) public accountId!: string
  @Prop({ type: String }) public nftId!: string
  @Prop(Boolean) public burned!: boolean
  @Prop(Boolean) public simple!: boolean // submit heart directly

  protected showDialog = false

  mounted() {
    window.addEventListener('click', this.handleMouseClick)
  }

  beforeDestroy() {
    window.removeEventListener('click', this.handleMouseClick)
  }

  handleMouseClick(e: MouseEvent) {
    if (e.target && !this.$el.contains(e.target as HTMLElement)) {
      this.showDialog = false
    }
    return false
  }

  protected toggleEmojiDialog() {
    if (this.simple) {
      showNotification('[EMOTE] Sending ♥️')
      return this.submit('2764') // heart emoji
    } else {
      this.showDialog = !this.showDialog
    }
  }

  protected async onSelectEmoji(emoji: IEmoji) {
    const { version, nftId } = this
    if (!this.accountId) {
      return showNotification(
        '[EMOTE] Please connect your wallet first',
        notificationTypes.warn
      )
    }
    const emote = emojiUnicode(emoji.data).split(' ')[0].toUpperCase()
    if (emote) {
      showNotification(`[EMOTE] Selected ${emoji.data} or ${emote}`)
      const rmrk = createInteraction(Interaction.EMOTE, version, nftId, emote)
      await this.submit(rmrk)
    } else {
      showNotification('[EMOTE] Unable to emote', notificationTypes.warn)
    }
  }

  private mapToEmoji(parsed: string) {
    const emoji: Emoji = {
      data: parsed,
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
    const api = await this.useApi()

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
      this.$consola.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

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
  border-top: $sleek-primary-border !important;
  color: $primary;
  margin-right: 15px;
}
</style>

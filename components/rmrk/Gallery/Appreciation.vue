<template>
  <div class="nft-appreciation__main is-flex">
    <Loader v-model="isLoading" :status="status" />
    <IndexerGuard>
      <b-button
        v-if="accountId"
        class="nft-appreciation__button"
        icon-left="heart"
        @click="showDialog = !showDialog" />
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
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import groupBy from '@/utils/groupBy'
import EmotionList from './EmotionList.vue'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { VEmojiPicker } from 'v-emoji-picker'
import emojiUnicode from 'emoji-unicode'
import NFTUtils from '../service/NftUtils'
import { Emoji, IEmoji } from 'v-emoji-picker/lib/models/Emoji'
import { Emote } from '../service/scheme'

@Component({
  components: {
    EmotionList,
    VEmojiPicker,
    Loader: () => import('@/components/shared/Loader.vue'),
    IndexerGuard: () => import('@/components/shared/wrapper/IndexerGuard.vue'),
  },
})
export default class Appreciation extends mixins(RmrkVersionMixin) {
  @Prop() public emotes!: Emote[]
  @Prop() public currentOwnerId!: string
  @Prop() public accountId!: string
  @Prop() public nftId!: string
  @Prop(Boolean) public burned!: boolean

  protected showDialog = false
  protected isLoading = false
  protected status = ''

  protected async onSelectEmoji(emoji: IEmoji) {
    const { version, nftId } = this
    const emote = emojiUnicode(emoji.data).split(' ')[0].toUpperCase()
    if (emote) {
      showNotification(`[EMOTE] Selected ${emoji.data} or ${emote}`)
      const rmrk = NFTUtils.createInteraction('EMOTE', version, nftId, emote)
      this.isLoading = true
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
    // const rmrkService = getInstance();
    try {
      showNotification(rmrk)
      console.log('submit', rmrk)
      const tx = await exec(
        this.accountId,
        '',
        api.tx.system.remark,
        [rmrk],
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            showNotification(blockHash.toString(), notificationTypes.info)

            showNotification(`[EMOTE] ${this.nftId}`, notificationTypes.success)
            this.isLoading = false
            this.showDialog = false
          },
          (err) => {
            execResultValue(tx)
            showNotification(`[ERR] ${err.hash}`, notificationTypes.danger)
            this.isLoading = false
          },
          (res) => {
            if (res.status.isReady) {
              this.status = 'loader.casting'
              return
            }

            if (res.status.isInBlock) {
              this.status = 'loader.block'
              return
            }

            if (res.status.isFinalized) {
              this.status = 'loader.finalized'
              return
            }

            this.status = ''
          }
        )
      )
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e)
    }
  }

  // async fetchAppreciationsForNFT(id: string) {
  //   const rmrkService = getInstance();
  //   try {
  //     const appreciations = await rmrkService?.getAppreciationsForNFT(id);
  //     this.emotions = groupBy(appreciations || [], 'metadata');
  //     console.log(this.emotions);
  //   } catch (e) {
  //     console.warn(`[Appreciation] unable to fetch appreciations ${e}`);
  //   }
  // }

  // @Watch('nftId')
  // private watchNftId(val: string, oldVal: string) {
  //   if (shouldUpdate(val, oldVal)) {
  //     this.fetchAppreciationsForNFT(val);
  //   }
  // }
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
  border: 2px solid $primary;
  color: $primary;
  margin-right: 15px;
}
</style>

<template>
  <div class="nft-appreciation__main mb-4">
    <Loader v-model="isLoading" :status="status" />
    <b-button
      class="nft-appreciation__button"
      icon-left="heart"
      @click="showDialog = !showDialog"
    />
    <VEmojiPicker
      v-show="showDialog"
      labelSearch="Search your emote"
      @select="onSelectEmoji"
      class="emote-picker"
    />
    <EmotionList class="emote-list" :emotions="emotions" />
  </div>
</template>

<script lang="ts" >
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import shouldUpdate from '@/utils/shouldUpdate';
import groupBy from '@/utils/groupBy';
import EmotionList from './EmotionList.vue';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';
import { VEmojiPicker } from 'v-emoji-picker';
import emojiUnicode from 'emoji-unicode';
import NFTUtils from '../service/NftUtils';
import { IEmoji } from 'v-emoji-picker/lib/models/Emoji';
import { Emote } from '../service/scheme';

@Component({
  components: {
    EmotionList,
    VEmojiPicker,
    Loader: () => import('@/components/shared/Loader.vue')
  }
})
export default class Appreciation extends Mixins(RmrkVersionMixin) {
  @Prop() public emotes!: Emote[];
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public nftId!: string;
  @Prop(Boolean) public burned!: boolean;

  protected showDialog: boolean = false;
  protected isLoading: boolean = false;
  protected status: string = '';

  protected async onSelectEmoji(emoji: IEmoji) {
    const { version, nftId } = this;
    const emote = emojiUnicode(emoji.data)
      .split(' ')[0]
      .toUpperCase();
    if (emote) {
      showNotification(`[EMOTE] Selected ${emoji.data} or ${emote}`);
      const rmrk = NFTUtils.createInteraction('EMOTE', version, nftId, emote);
      this.isLoading = true;
      await this.submit(rmrk);
    } else {
      showNotification('[EMOTE] Unable to emote', notificationTypes.warn);
    }
  }

  get emotions(): Record<string, string | number> {
    return groupBy(this.emotes || [], 'value');
  }

  private async submit(rmrk: string) {
    const { api } = Connector.getInstance();
    // const rmrkService = getInstance();
    try {
      showNotification(rmrk);
      console.log('submit', rmrk);
      const tx = await exec(
        this.accountId,
        '',
        api.tx.system.remark,
        [rmrk],
        txCb(
          async blockHash => {
            execResultValue(tx);
            showNotification(blockHash.toString(), notificationTypes.info);

            showNotification(
              `[EMOTE] ${this.nftId}`,
              notificationTypes.success
            );
            this.isLoading = false;
            this.showDialog = false;
          },
          err => {
            execResultValue(tx);
            showNotification(`[ERR] ${err.hash}`, notificationTypes.danger);
            this.isLoading = false;
          },
          res => {
            if (res.status.isReady) {
              this.status = 'loader.casting';
              return;
            }

            if (res.status.isInBlock) {
              this.status = 'loader.block';
              return;
            }

            if (res.status.isFinalized) {
              this.status = 'loader.finalized';
              return;
            }

            this.status = '';
          }
        )
      );
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger);
      console.error(e);
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
@import "@/colors";

.emote-picker {
  position: absolute;
  z-index: 1;
}

.nft-appreciation__main {
  min-height: 40px;
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
}

.nft-emotion__main {
  padding-left: 60px;
  margin-top: -40px;
}
</style>

<template>
  <div class="nft-appreciation__main">
    <b-tooltip
      v-if="accountId && nftId"
      type="is-light"
      :triggers="['click', 'mouseIn']"
      :auto-close="['outside', 'escape', 'mouseOut']"
      multilined
      size="is-large"
      class="nft-appreciation__tooltip"
    >
      <template v-slot:content>
        <div class="columns is-multiline is-mobile">
          <div
            class="column nft-appreciation__column is-one-quarter is-one-quarter-mobile"
            v-for="emoji in availableEmojis"
            :key="emoji"
            @click="appreciate(emoji)"
          >
            <b-image
              class="nft-appreciation__wrapper"
              :src="require(`@/components/rmrk/emoji/${emoji}.png`)"
              alt="Simple image"
              ratio="1by1"
              rounded
            ></b-image>
          </div>
        </div>
      </template>
      <b-button class="nft-appreciation__button"  icon-left="heart" expanded />
    </b-tooltip>
    <EmotionList :emotions="emotions" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import shouldUpdate from '@/utils/shouldUpdate';
import groupBy from '@/utils/groupBy';
import EmotionList from './EmotionList.vue';

@Component({
  components: {
    EmotionList
  }
})
export default class Appreciation extends Vue {
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public nftId!: string;
  private version: string = 'RMRK1.0.0';
  private action = 'EMOTE';
  private availableEmojis: string[] = [
    '1F440',
    '1F496',
    '1F389',
    '1F44F',
    '1F4A1',
    '1F914',
    '1F618',
    '1F60A'
  ];
  private emotions: any = {};

  private appreciate(emoji: string) {
    console.log('clicked', emoji);
    const { version, nftId, action } = this;
    const rmrk = `RMRK::${action}::${version}::${nftId}::${emoji}`;
    this.submit(rmrk);
  }

  private async submit(rmrk: string) {
    const { api } = Connector.getInstance();
    const rmrkService = getInstance();

    try {
      showNotification(rmrk);
      console.log('submit', rmrk);
      const tx = await exec(this.accountId, '', api.tx.system.remark, [rmrk]);
      showNotification(execResultValue(tx), notificationTypes.success);
      console.warn('TX IN', tx);
      const persisted = await rmrkService?.resolve(rmrk, this.accountId);
      console.log(persisted);
      console.log('SAVED', persisted?._id);
      showNotification(
        `[TEXTILE] ${persisted?._id}`,
        notificationTypes.success
      );
      await this.fetchAppreciationsForNFT(this.nftId)
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger);
      console.error(e);
    }
  }

  async fetchAppreciationsForNFT(id: string) {
    const rmrkService = getInstance();
    try {
      const appreciations = await rmrkService?.getAppreciationsForNFT(id);
      this.emotions = groupBy(appreciations || [], 'metadata');
      console.log(this.emotions);
    } catch (e) {
      console.warn(`[Appreciation] unable to fetch appreciations ${e}`);
    }
  }

  @Watch('nftId')
  private watchNftId(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchAppreciationsForNFT(val);
    }
  }
}
</script>

<style scoped>
.nft-appreciation__main {
  margin: 1em 0;
}
.nft-appreciation__column {
  padding: 0.45em;
}

.nft-appreciation__wrapper:hover {
  cursor: pointer;
  background-color: #dedddd;
}

.nft-appreciation__button {
  width: 100%;
}

.nft-appreciation__tooltip {
  width: 100%;
}

</style>

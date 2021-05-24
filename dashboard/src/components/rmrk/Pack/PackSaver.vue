<template>
  <div class="nft-appreciation__main my-4">
    <b-dropdown
      v-model="currentMenu"
      @input="handleInput"
      multiple
      aria-role="list"
      expanded
      scrollable
      :max-height="200"
      >
      <template #trigger>
        <b-button type="is-primary" outlined icon-left="bookmark" expanded>
          Save to pack ({{ currentMenu.length }})
        </b-button>
      </template>

      <b-dropdown-item
        v-for="(menu, index) in menus"
        :key="index"
        :value="menu._id"
        aria-role="listitem"
      >
        <div class="media">
          <div class="menu-down">
            <h3>{{ menu.name }}</h3>
          </div>
        </div>
      </b-dropdown-item>

      <b-dropdown-item class="pack-saver-input__wrapper" custom aria-role="listitem">
        <b-input class="pack-saver-input__input" v-model="newPackName" placeholder="New pack name" expanded />
        <b-button type="is-info" outlined :disabled="!newPackName" @click="addPack" icon-left="plus" :loading="isLoading" />
      </b-dropdown-item>
    </b-dropdown>
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
import { Debounce } from 'vue-debounce-decorator'

import { Pack } from '@/components/rmrk/service/scheme';
import { emptyObject } from '@/utils/empty';

@Component
export default class PackSaver extends Vue {
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public nftId!: string;
  private currentMenu: string[] = [];
  private savedMenu: Record<string,boolean> = {};
  private menus: Pack[] = [];
  private newPackName = '';
  protected isLoading = false;

  protected async addPack() {
    const rmrkService = getInstance();
    const pack = emptyObject<Pack>();
    pack.nfts = { [this.nftId]: true }
    pack.name = this.newPackName

    this.isLoading = true;

    try {
      const persisted = await rmrkService?.createPack(pack, this.accountId);
      this.$set(this.menus, this.menus.length, persisted);
      this.$set(this.currentMenu, this.currentMenu.length, persisted?._id);
      showNotification(`[Textile] Saved pack ${persisted?.name}`);
      this.newPackName = ''

    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger);
      console.error(e);
    }

    this.isLoading = false

  }

  @Debounce(1500)
  protected handleInput(value: string[]) {
    console.log('new value is,', value, 'database has', this.savedMenu)
    const changeLog: Record<string, boolean> = {...this.savedMenu};
    Object.keys(changeLog).forEach(m => {
      changeLog[m] = false
    })

    value.forEach(id => changeLog[id] = true)
    console.log('[SHOULD SAVE]', changeLog, 'from', this.savedMenu)
    this.submit(changeLog)
  }

  protected async submit(changeLog: Record<string, boolean>) {
      const rmrkService = getInstance();
      try {
        const persisted = await rmrkService?.addNFTToPacks(this.nftId, changeLog, this.accountId);
        if (Object.keys(persisted || {}).length) {
          this.savedMenu = {...persisted}
          showNotification(`[Textile] packs updated`);
        }
      } catch (e) {
        showNotification(`[ERR] ${e}`, notificationTypes.danger);
        console.error(e);
      }
  }

  public mounted() {
    if (this.accountId) {
      // fugly hack to avoid race conditions on texile
      setTimeout(() => this.fetchPacksForUser(this.accountId), 1000)
    }
  }

  // private async submit(rmrk: string) {
  //   const { api } = Connector.getInstance();
  //   const rmrkService = getInstance();

  //   try {

  //     showNotification(rmrk);
  //     console.log('submit', rmrk);
  //     const tx = await exec(this.accountId, '', api.tx.system.remark, [rmrk]);
  //     showNotification(execResultValue(tx), notificationTypes.success);
  //     console.warn('TX IN', tx);
  //     const persisted = await rmrkService?.resolve(rmrk, this.accountId);
  //     console.log(persisted);
  //     console.log('SAVED', persisted?._id);
  //     showNotification(
  //       `[TEXTILE] ${persisted?._id}`,
  //       notificationTypes.success
  //     );

  //   } catch (e) {
  //     showNotification(`[ERR] ${e}`, notificationTypes.danger);
  //     console.error(e);
  //   }
  // }

  async fetchPacksForUser(id: string) {
    const rmrkService = getInstance();
    try {
      const packs = await rmrkService?.getPackListForAccount(id);
      console.log(packs);
      this.menus = packs || [];
      this.currentMenu =  this.menus.filter(m =>  m.nfts[this.nftId]).map(m => m.id)
      this.savedMenu = this.currentMenu.reduce((acc, val) => ({...acc, [val]: true }) ,{});
    } catch (e) {
      console.warn(`[Pack] unable to fetch appreciations ${e}`);
    }
  }

  @Watch('accountId')
  protected watchAccountId(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchPacksForUser(val);
    }
  }
}
</script>

<style scoped>
.pack-saver-input__wrapper {
  display: flex;
}

.pack-saver-input__input {
  flex-grow: 1;
}
</style>

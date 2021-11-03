<template>
  <div id="Dropdown">
    <section>
      <b-field>
        <p>
          {{ label }}
          <b-tooltip
            type="is-dark"
            :label="tooltip"
          >
            <b-icon
              size="is-small"
              icon="question-circle"
            />
          </b-tooltip>
        </p>
      </b-field>
      <b-field>
        <b-dropdown
          v-model="selected"
          :mobile-modal="false"
          aria-role="list"
        >
          <button
            slot="trigger"
            class="button is-primary"
            type="button"
          >
            <template v-if="selected">
              <b-icon icon="users" />
              <span>{{ selected | shortAddress(10, -10) }}</span>
            </template>
            <template v-else>
              <b-icon icon="users" />
              <span>Select Account</span>
            </template>
            <b-icon icon="caret-down" />
          </button>
          <template v-if="accounts">
            <b-dropdown-item
              v-for="acc in accounts"
              :key="acc.address"
              aria-role="listitem"
              :value="acc.address"
            >
              <div class="media">
                <b-icon
                  class="media-left"
                  icon="users"
                />
                <div class="media-content">
                  <h3>{{ acc.meta.name }}</h3>
                  <small>{{ acc.address | shortAddress(10, -10) }}</small>
                </div>
              </div>
            </b-dropdown-item>
          </template>
        </b-dropdown>
      </b-field>
      <b-field>
        <AccountNameTag :meta-name="selectedMetaName" />
        <Balance
          v-if="!nobalance"
          :account="selectedAccount"
        />
      </b-field>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch } from 'nuxt-property-decorator'
import WithKeyring from '../../utils/WithKeyring'
import Balance from './Balance.vue'
import AccountNameTag from './AccountNameTag.vue'

@Component({
  components: {
    Balance,
    Dropdown,
    AccountNameTag,
  },
})
export default class Dropdown extends WithKeyring {
  @Prop() private nobalance!: boolean;
  @Prop({ default: 'all' }) public mode!: string;
  @Prop() public externalAddress!: string;

  private position = 'is-left';
  private selectedMetaName = '';
  private selectedAccount = '';
  private label = 'To Contacts';
  private tooltip = 'Select a contact you want to send funds to.';

  get accounts() {
    // return this.keyringAccounts.filter((acc) => !acc.meta.isTesting);
    return this.keyringAccounts
  }

  get selected() {
    return this.selectedAccount
  }

  set selected(address: string) {
    this.selectedAccount = address
    this.onSelectedAccount(address)
  }

  @Emit('selected')
  public onSelectedAccount(address: string) {
    const acc = this.getPair(address)
    this.selectedMetaName = (acc.meta.name as string);
    (window as any).acc = acc
    return this.getPair(address)
  }

  @Watch('externalAddress')
  public loadAddress(): void {
    this.selectedAccount = this.externalAddress
  }

  public mounted(): void {
    this.gotKeys(this.mode)
    if (this.externalAddress) {
      this.selectedAccount = this.externalAddress
    }
  }

  private gotKeys(mode: string): void {
    if (mode === 'accounts') {
      this.label = 'From Accounts'
      this.tooltip = 'The account you will send funds from.'
    }
  }
}

</script>

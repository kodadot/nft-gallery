<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            {{ $t("identity.set") }}
          </p>
          <b-field>
            <Auth />
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import exec, { execResultValue } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import Connector from '@vue-polkadot/vue-api'
import { isFunction } from '@polkadot/util'
@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
    AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
    PasswordInput: () => import('@/components/shared/PasswordInput.vue')
  }
})
export default class SetIdentity extends Vue {
  // @Prop() public referendumId!: any;
  private accountId = '';
  private password = '';
  private identity: Record<string, string> = {
    display: '',
    email: '',
    web: '',
    twitter: '',
    riot: '',
    tel: '',
    legal: ''
  };
  private additional = [];
  private tx = '';
  public enhanceIdentityData(): any {
    return Object.fromEntries(
      Object.entries(this.identity).map(([key, val]: [string, string]) => {
        if (val) {
          return [key, { raw: val }]
        }
        return [key, { none: null }]
      })
    )
  }
  public async shipIt() {
    const { api } = (this as any).$http
    if (!api) {
      return
    }
    try {
      showNotification('Dispatched')
      const enhancedData = this.enhanceIdentityData()
      const x = {
        ...enhancedData,
        additional: [[{ raw: 'telephone' }, { raw: this.identity.tel }]]
      }
      const tx = await exec(
        this.accountId,
        this.password,
        api.tx.identity.setIdentity,
        [x]
      )
      showNotification(`Identity ${tx}`, notificationTypes.success)
    } catch (e) {
      showNotification(e, notificationTypes.danger)
    }
  }
  @Watch('accountId')
  protected watchAccountChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchIdentity(val)
    }
  }
  protected async fetchIdentity(val: string) {
    const { api } = Connector.getInstance()
    try {
      const res = await api.query.identity.identityOf(val)
      if (res.isEmpty || res.isNone) {
        throw new EvalError(val)
      }
      const identity = res.unwrapOr(null)
      if (!identity) {
        throw new EvalError(val)
      }
    } catch (e) {
      console.warn(`No identity for ${e.message}`)
    }
  }
}
</script>

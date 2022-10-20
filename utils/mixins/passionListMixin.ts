import { Component, mixins } from 'nuxt-property-decorator'
import AuthMixin from './authMixin'
import PrefixMixin from './prefixMixin'

import passionQuery from '@/queries/rmrk/subsquid/passionFeed.graphql'

type PassionList = string[]

@Component
export default class PassionListMixin extends mixins(AuthMixin, PrefixMixin) {
  public passionList: string[] = ['']

  async created() {
    if (this.isLogIn) {
      this.passionList = this.passionList.concat(await this.fetchPassionList())
    }
  }

  public async fetchPassionList(): PassionList {
    const {
      data: { passionFeed },
    } = await this.$apollo.query({
      query: passionQuery,
      client: this.client,
      variables: {
        account: this.accountId,
      },
      fetchPolicy: 'cache-first',
    })

    return passionFeed?.map((x) => x.id) || []
  }
}

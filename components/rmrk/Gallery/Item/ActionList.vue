<template>
  <div class="buttons">
    <b-tooltip
      class="w-100"
      :active="!isMakeOffersAllowed"
      :label="tooltipOfferLabel">
      <b-button
        v-for="action in actions"
        :key="action"
        :type="iconType(action)"
        :disabled="
          action === ShoppingActions.MAKE_OFFER && !isMakeOffersAllowed
        "
        outlined
        expanded
        @click="handleActionSelect(action)">
        {{ actionLabel(action) }}
      </b-button>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import {
  getActionButtonColor,
  getActionButtonLabel,
  ShoppingActions,
} from '@/utils/shoppingActions'
import { TranslateResult } from 'vue-i18n/types'

@Component({})
export default class ActionList extends Vue {
  @Prop({ type: Array, required: false }) public actions!: ShoppingActions[]
  @Prop(Boolean) public isMakeOffersAllowed!: boolean
  @Prop(String) public tooltipOfferLabel!: string

  private ShoppingActions = ShoppingActions

  @Emit('click')
  protected handleActionSelect(action: ShoppingActions) {
    return action
  }

  protected iconType(value: ShoppingActions): string {
    return getActionButtonColor(value)
  }

  protected actionLabel(value: ShoppingActions): TranslateResult {
    return getActionButtonLabel(value, this)
  }
}
</script>

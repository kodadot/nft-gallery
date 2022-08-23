<template>
  <div class="buttons">
    <b-tooltip
      v-for="action in actions"
      :key="action"
      append-to-body
      :active="disableButton(action)"
      position="is-left"
      :label="disabledToolTips[action]">
      <b-button
        :type="iconType(action)"
        :disabled="disableButton(action)"
        outlined
        expanded
        class="only-border-top"
        :data-cy="action"
        @click="handleActionSelect(action)">
        {{ actionLabel(action) }}
      </b-button>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import {
  ShoppingActionToolTips,
  ShoppingActions,
  getActionButtonColor,
  getActionButtonLabelKey,
} from '~/utils/shoppingActions'
import { TranslateResult } from 'vue-i18n/types'

@Component({})
export default class ActionList extends Vue {
  @Prop({ type: Array, required: false }) public actions!: ShoppingActions[]
  @Prop(Boolean) public isMakeOffersAllowed!: boolean
  @Prop(String) public price!: string

  // keys in `disabledToolTips` are disabled actions. values are their tooltips.
  @Prop({ type: Object, required: true })
  public disabledToolTips!: ShoppingActionToolTips

  @Emit('click')
  protected handleActionSelect(action: ShoppingActions) {
    return action
  }

  public disableButton(action: ShoppingActions): boolean {
    return Object.keys(this.disabledToolTips).includes(action)
  }

  protected iconType(value: ShoppingActions): string {
    return getActionButtonColor(value)
  }

  protected actionLabel(action: ShoppingActions): TranslateResult {
    return this.$t(getActionButtonLabelKey(action, this.price))
  }
}
</script>

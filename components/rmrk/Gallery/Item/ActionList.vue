<template>
  <div class="buttons">
    <b-tooltip
      class="w-100"
      :active="!isMakeOffersAllowed"
      :label="$t('tooltip.makeOfferDisabled')">
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
        {{ action }}
      </b-button>
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { getActionButtonColor, ShoppingActions } from '@/utils/shoppingActions'

@Component({})
export default class ActionList extends Vue {
  @Prop({ type: Array, required: false }) public actions!: ShoppingActions[]
  @Prop(Boolean) public isMakeOffersAllowed!: boolean

  private ShoppingActions = ShoppingActions

  @Emit('click')
  protected handleActionSelect(action: ShoppingActions) {
    return action
  }

  protected iconType(value: ShoppingActions): string {
    return getActionButtonColor(value)
  }
}
</script>

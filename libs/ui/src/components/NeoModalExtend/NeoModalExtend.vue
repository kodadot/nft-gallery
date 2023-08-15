<script lang="ts">
import { OModal } from '@oruga-ui/oruga'

export default {
  name: 'NeoModalExtend',
  extends: OModal,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga/src/scss/components/_modal.scss';

.o-modal {
  z-index: 998;

  &__content {
    border-radius: 0;
  }

  &__overlay {
    background-color: rgba(0, 0, 0, 0.17);
  }
}
</style>

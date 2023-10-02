<script lang="ts">
import { OModal } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoModalExtend',
  extends: OModal,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga-next/src/scss/components/_modal.scss';

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

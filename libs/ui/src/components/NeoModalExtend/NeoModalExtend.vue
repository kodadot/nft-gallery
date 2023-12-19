<script lang="ts">
import { OModal } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoModalExtend',
  extends: OModal,
}
</script>

<style lang="scss">
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';

$modal-zindex: 998;
$modal-overlay-background-color: rgb(0 0 0 / 0.17);
$modal-content-border-radius: 0;

@import '@oruga-ui/oruga-next/src/scss/components/_modal.scss';
</style>

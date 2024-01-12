<script lang="ts">
import { OModal } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoModalExtend',
  extends: OModal,
}
</script>

<style lang="scss">
@import '@oruga-ui/theme-oruga/dist/scss/utils/_variables.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_animations.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_helpers.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_root.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_base.scss';

$modal-zindex: 998;
$modal-overlay-background-color: rgb(0 0 0 / 0.17);
$modal-content-border-radius: 0;

@import '@oruga-ui/theme-oruga/dist/scss/components/_modal.scss';
</style>

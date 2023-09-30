<script lang="ts">
import { ONotification } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoNotification',
  extends: ONotification,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga-next/src/scss/components/_notification.scss';

.o-notices {
  top: 4.5rem;

  .o-notification {
    padding: 1rem 2rem;
  }
}

.is-neo-toast {
  font-size: 12px;
  border-radius: 0;
  padding: 0.5rem 1rem !important;

  @include ktheme() {
    background-color: theme('background-color');
    border: 1px solid theme('border-color');
    box-shadow: theme('primary-shadow');
    color: theme('text-color');
    -webkit-box-shadow: theme('primary-shadow');

    &:hover {
      background-color: theme('k-accentlight');
    }
  }
}
</style>

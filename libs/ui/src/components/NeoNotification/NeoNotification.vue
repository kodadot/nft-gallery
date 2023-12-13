<script lang="ts">
import { ONotification } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoNotification',
  extends: ONotification,
}
</script>

<style lang="scss">
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';
@import '@oruga-ui/oruga-next/src/scss/components/_notification.scss';

.o-notices {
  @apply top-[4.5rem];

  .o-notification {
    @apply py-4 px-8;

    &--component {
      @apply p-0 #{!important};
      @apply bg-[unset];
    }
  }
}

.is-neo-toast {
  @apply text-xs rounded-none bg-background-color border-default border-border-color shadow-primary text-text-color;
  @apply py-2 px-4 #{!important};

  &:hover {
    @apply bg-k-accent-light;
  }
}
</style>

<script lang="ts">
import { ONotification } from '@oruga-ui/oruga-next'

export default {
  name: 'NeoNotification',
  extends: ONotification,
}
</script>

<style lang="scss">
@import '@oruga-ui/theme-oruga/dist/scss/utils/_variables.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_animations.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_helpers.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_root.scss';
@import '@oruga-ui/theme-oruga/dist/scss/utils/_base.scss';
@import '@oruga-ui/theme-oruga/dist/scss/components/_notification.scss';

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

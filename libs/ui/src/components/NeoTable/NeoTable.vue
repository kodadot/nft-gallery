<script lang="ts">
import { OTable } from '@oruga-ui/oruga-next'

export default {
  extends: OTable,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>

<style lang="scss">
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';

$table-border: 0;
$table-border-radius: 0;
$table-td-border: 0;
$table-th-border: 0;
$table-th-font-weight: 400;

@import '@oruga-ui/oruga-next/src/scss/components/_table.scss';

.o-table {
  @apply text-text-color bg-background-color;

  &__root {
    @apply overflow-x-auto;
  }

  &__th {
    @apply text-xs text-k-grey bg-background-color;
  }

  &__detail {
    @apply text-text-color bg-background-color;
  }

  @media (max-width: 1024px) {
    tbody tr {
      @apply pt-6 bg-background-color;
    }

    &__td {
      &::before {
        @apply text-xs/4.5 text-k-grey;
      }

      @apply my-0 mx-6 py-1 px-0;

      &:last-child {
        @apply border-b-default border-b-k-shade;
      }
    }

    &--hoverable {
      tbody tr:hover td {
        @apply bg-background-color;
      }
    }
  }

  &--hoverable {
    tbody tr:hover td {
      @apply bg-k-accent-light-2;
    }
  }
}
</style>

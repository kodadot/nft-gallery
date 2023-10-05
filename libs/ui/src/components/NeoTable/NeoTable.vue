<script lang="ts">
import { OTable } from '@oruga-ui/oruga-next'

export default {
  extends: OTable,
}
</script>

<style lang="scss">
@import '../../scss/_theme.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_expressions.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_variables.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_animations.scss';
@import '@oruga-ui/oruga-next/src/scss/utilities/_helpers.scss';

$table-border: 0;
$table-border-radius: 0;
$table-td-border: 0;
$table-th-border: 0;
$table-th-font-weight: 400;

.o-table {
  @include ktheme() {
    color: theme('text-color');
    background-color: theme('background-color');
  }

  &__root {
    overflow-x: auto;
  }

  &__th {
    font-size: 12px;
    @include ktheme() {
      color: theme('k-grey');
      background-color: theme('background-color');
    }
  }

  &__detail {
    @include ktheme() {
      color: theme('text-color');
      background-color: theme('background-color');
    }
  }

  @media (max-width: 1024px) {
    tbody tr {
      padding-top: 1.5rem;
      @include ktheme() {
        background-color: theme('background-color') !important;
      }
    }

    &__td {
      &::before {
        font-size: 0.75rem;
        line-height: 1.5rem;
        @include ktheme() {
          color: theme('k-grey');
        }
      }

      margin: 0 1.5rem;
      padding: 0.25rem 0;

      &:last-child {
        @include ktheme() {
          border-bottom: 1px solid theme('k-shade') !important;
        }
      }
    }

    &--hoverable {
      tbody tr:hover td {
        @include ktheme() {
          background-color: theme('background-color') !important;
        }
      }
    }
  }

  &--hoverable {
    tbody tr:hover td {
      @include ktheme() {
        background-color: theme('k-accentlight2');
      }
    }
  }
}

@import '@oruga-ui/oruga-next/src/scss/components/_table.scss';
</style>

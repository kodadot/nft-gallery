<script lang="ts">
import { OPagination } from '@oruga-ui/oruga-next'

export default {
  extends: OPagination,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>

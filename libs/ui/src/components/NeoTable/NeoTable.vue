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

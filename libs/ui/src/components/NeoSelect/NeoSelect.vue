<script>
import { OSelect } from '@oruga-ui/oruga-next'

export default {
  mixins: [OSelect],
  computed: {
    rootClasses() {
      return [
        'neo-select',
        this.computedClass('rootClass', 'o-ctrl-sel'),
        {
          [this.computedClass('expandedClass', 'o-ctrl-sel--expanded')]:
            this.expanded,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>

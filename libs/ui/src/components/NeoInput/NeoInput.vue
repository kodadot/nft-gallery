<script>
import { OInput } from '@oruga-ui/oruga-next'

export default {
  mixins: [OInput],
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
  computed: {
    rootClasses() {
      return [
        'neo-input',
        this.computedClass('rootClass', 'o-ctrl-input'),
        {
          [this.computedClass('expandedClass', 'o-ctrl-input--expanded')]:
            this.expanded,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>

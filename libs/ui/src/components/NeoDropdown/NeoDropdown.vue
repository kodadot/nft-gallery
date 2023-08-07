<script>
import { ODropdown } from '@oruga-ui/oruga-next'

export default {
  mixins: [ODropdown],
  computed: {
    rootClasses() {
      return [
        'neo-dropdown',
        this.computedClass('rootClass', 'o-drop'),
        {
          [this.computedClass('disabledClass', 'o-drop--disabled')]:
            this.disabled,
        },
        {
          [this.computedClass('expandedClass', 'o-drop--expanded')]:
            this.expanded,
        },
        { [this.computedClass('inlineClass', 'o-drop--inline')]: this.inline },
        {
          [this.computedClass('mobileClass', 'o-drop--mobile')]:
            this.isMobileModal && this.isMatchMedia && !this.hoverable,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>

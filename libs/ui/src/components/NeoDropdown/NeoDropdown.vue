<script>
import { ODropdown } from '@oruga-ui/oruga-next'

export default {
  mixins: [ODropdown],
  props: {
    mobileModal: {
      type: Boolean,
      default: false,
    },
    noShadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autoPosition: '',
    }
  },
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
    menuClasses() {
      return [
        this.computedClass('menuClass', 'o-drop__menu'),
        {
          [this.computedClass(
            'menuPositionClass',
            'o-drop__menu--',
            this.autoPosition
          )]: this.autoPosition,
        },
        {
          [this.computedClass('menuActiveClass', 'o-drop__menu--active')]:
            this.isActive || this.inline,
        },
        {
          [this.computedClass('menuShadowClass', 'no-shadow')]: this.noShadow,
        },
      ]
    },
    isAutoPosition() {
      return this.position?.includes('auto')
    },
  },
  mounted() {
    if (this.isAutoPosition) {
      this.calcDropdownPosition()
      window.addEventListener('resize', this.calcDropdownPosition)
    } else {
      this.autoPosition = this.position
    }
  },
  onBeforeUnmount() {
    window.removeEventListener('resize', this.calcDropdownPosition)
  },
  methods: {
    calcDropdownPosition() {
      // support pass `position` type of `top-auto` or `bottom-auto`
      // calc the dropdown position based on the trigger position
      const ele = this.$refs.trigger
      const side =
        ele.getBoundingClientRect().left < window.innerWidth / 2
          ? 'right'
          : 'left'
      this.autoPosition = this.position.replace('auto', side)
    },
  },
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>

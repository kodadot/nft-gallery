import { Component, Vue, Prop } from 'vue-property-decorator'
/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
@Component
export default class InlineMixin extends Vue {
  @Prop(Boolean) inline!: boolean

  get is() {
    return this.inline ? 'span' : 'div'
  }
}

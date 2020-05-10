import Vue from 'vue';
// declare type UnsubscribePromise = Promise<Unsubscribe>;
declare type Unsubscribe = () => void;

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
export default class SubscribeMixin extends Vue {
  private subs: Unsubscribe[] = [];

  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}

import { Component, Vue } from 'vue-property-decorator';
import isFunction from '@/utils/isFunction'
// declare type UnsubscribePromise = Promise<Unsubscribe>;

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
@Component
export default class QueryMixin extends Vue {
  protected keys: any = {};
  protected random: any[] = [];
  protected defaultValues: any[] = [];
  protected subs: any = {};

  protected magic(key: any, length: number, unwrap: any) {
    return (value: any) => {
      const val = unwrap ? unwrap(value) : value
      console.log(key, value)
      this.$set(this.defaultValues, length, val);
    };
  }

  protected async extractValue({ method, args, isConst, unwrap, valueMethod }: any) {
    if (isConst) {
      return method;
    }

    if (valueMethod) {
      if (unwrap) {
        return await valueMethod(...args).then(unwrap)
      }

      return await valueMethod(...args)
    }

    if (unwrap) {
      return await method(...args).then(unwrap)
    }

    return await method(...args)
  }

  protected async handleWatch({ key, method, args, isConst, unwrap, valueMethod }: any) {
    try {
     if (key.name in this.keys) {
      throw EvalError(`${key.name} already subscribed`)
    }
    const value = await this.extractValue({ key, method, args, isConst, unwrap, valueMethod });
    this.defaultValues = [...this.defaultValues, value];
    this.random = [...this.random, key];
    this.keys[key.name] = this.defaultValues.length - 1;
    this.subscribe(method, key.name, args, this.magic(key.name, this.keys[key.name], unwrap), isConst);
    } catch (e) {
      console.warn(e.message)
    }
  }

  public async subscribe(fn: any, key: any, args: any, callback: any, isConst?: boolean) {
    if (isConst) {
      this.subs[key] = fn;
    } else {
      this.subs[key] = await fn(...args, callback);
    }
    
  }

  public beforeDestroy() {
    Object.values(this.subs).forEach((sub: any) => sub());
  }

  public handleDeleteKey(key: any) {
    const index = this.keys[key];
    this.$delete(this.random, index);
    this.$delete(this.defaultValues, index);
    
    if (this.subs[key] && isFunction(this.subs[key])) {
      this.subs[key]();
    }
    this.$delete(this.subs, key);
    this.$delete(this.keys, key);
    this.keys = Object.fromEntries(Object.entries(this.keys).map(([keyIndex, value]: [string, any]) => [keyIndex, value > index ? value - 1 : value]))
  }


}

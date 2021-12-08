import { Component, Vue } from 'nuxt-property-decorator';
/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
@Component
export default class IndexerMixin extends Vue {
  get indexer() {
    return this.$store.getters['indexer/getIndexer'];
  }

  get healthy(): number {
    return this.indexer.indexerHealthy;
  }
}

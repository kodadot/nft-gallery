<template>
  <div>
    <CreateCollection />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateCollection from './CreateCollection.vue'

@Component({
  components: {
    CreateCollection
  }
})
export default class  extends Vue {
}
</script>

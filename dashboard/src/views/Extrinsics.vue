<template>
  <div>
    <b-tabs>
      <b-tab-item label="Extrinsic submission"></b-tab-item>
    </b-tabs>
    <Selection />
    <Executor />
  </div>
</template>

<script lang="ts">
import Selection from '../components/extrinsics/Selection.vue';
import Executor from '../components/extrinsics/Executor.vue';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { VueConstructor } from 'vue';

// hack in vue if you are extending class ;D
// const Selection = x as VueConstructor<Vue>

@Component({
  components: {
    Selection,
    Executor
  },
})
export default class Extrinsics extends Vue {
  private isValid: boolean = false;
  private isValidUnsigned: boolean = false;
  private method = null;

  
}
</script>

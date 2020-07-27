<template >
  <div>
    <b-table-column field="address" label="Address" width="40" numeric>
      {{ props.row.id }}
    </b-table-column>



    <b-table-column field="otherStake" label="Other Stake" >
      {{ props.row.user.last_name }}
    </b-table-column>

    <b-table-column field="ownStake" label="Own Stake" >
      {{ props.row.user.last_name }}
    </b-table-column>

    <b-table-column field="commission" label="Commision" >
      {{ props.row.user.last_name }}
    </b-table-column>

      <b-table-column field="points" label="Points" >
      {{ props.row.user.last_name }}
    </b-table-column>

      <b-table-column field="last" label="Last #" >
      {{ props.row.user.last_name }}
    </b-table-column>


  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';


@Component({})
export default class ValidatorRow extends Vue {
  @Prop() public props!: any;
}
</script>

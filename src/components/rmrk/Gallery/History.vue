<template>
  <div>
    <p class="label">
      {{ $t('History')}}
    </p>
    <b-table :data="data"
      hoverable
    >
      <b-table-column
      cell-class="short-identity__table"
      field= 'Type'
      label= 'Type'
      centered
      v-slot="props"
      >
      {{props.row.Type}}
      </b-table-column>
    <b-table-column
      cell-class="short-identity__table"
      field= 'From'
      label= 'From'
      centered
      v-slot="props"
      >
        <router-link :to="{ name: 'profile', params: { id: props.row.From } }">
          <Identity :address="props.row.From" inline noOverflow />
        </router-link>
    </b-table-column> 
    <b-table-column
      cell-class="short-identity__table"
      field= 'To'
      label= 'To'
      centered
      v-slot="props"
      >
        <router-link :to="{ name: 'profile', params: { id: props.row.To } }">
          <Identity :address="props.row.To" inline noOverflow />
        </router-link>
    </b-table-column>
    <b-table-column
      cell-class="short-identity__table"
      field= 'Amount'
      label= 'Amount'
      centered
      v-slot="props"
      >
      {{props.row.Amount}}
    </b-table-column>
    <b-table-column
      cell-class="short-identity__table"
      field= 'Date'
      label= 'Date'
      centered
      v-slot="props"
      >
      {{props.row.Date}}      
    </b-table-column>


    </b-table>
  </div> 
</template>   

<script lang="ts">

import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

const components = {
    Identity: () => import('@/components/shared/format/Identity.vue'),
};

@Component({ components })

export default class History extends Vue{

  @Prop() public events!: [];
  protected data: any = [];

  public async created(){
    this.createTable();
  }
  protected createTable(){

    let prevOwner : string = '';
    let curPrice : string = '0.0000000';
    for(const newEvent of this.events){
      const event : any = {};

      // Type
      if(newEvent['interaction'] === 'MINTNFT'){
        event['Type'] = 'CREATE';
        event['From'] = newEvent['caller'];
        event['To'] = '';
      }
      else if(newEvent['interaction'] === 'LIST'){
        event['Type'] = 'SET-PRICE';
        event['From'] = newEvent['caller'];
        event['To'] = '';
        prevOwner = event['From'];
        curPrice = newEvent['meta'];
      }
      else
        event['Type'] = newEvent['interaction'];

      // From
      if(!('From' in event))
        event['From'] = prevOwner;
      // To
      if(!('To' in event)){
        event['To'] = newEvent['caller']
        prevOwner = event['To'];
      }

      // Amount
      event['Amount'] = Vue.filter('formatBalance')(curPrice, 12, 'KSM');
      // Date
      const date = new Date(newEvent['timestamp'])
      event['Date'] = this.parseDate(date);

      this.data.push(event);
    }
    this.data = this.data.reverse();
  }
  protected parseDate(date: Date){
    const utcDate: string = date.toUTCString(); 
    return utcDate.substring(4);
  }

  @Watch('events')
  async watchEvent(newEvent: [], oldEvent: []){
  	this.createTable();
  }

}

</script>
<style>
  .short-identity__table {
    max-width: 50em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

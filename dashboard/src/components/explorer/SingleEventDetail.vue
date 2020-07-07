<template>
  <div>
    <!-- {{ event.data}} -->
    <!-- {{ phase}} --->
    <!-- {{ record }} -->
    <!-- <div v-for="(data, index) in record" :key="index">
      {{data}} -->
      <!-- {{data.toString()}} -->
      <!-- {{ record.typeDef[index].type }} -->
      <!-- <div v-for="(data, index) in e.data" :key="index"> -->
      <!-- {{e.typeDef[index].type}} -->
      <CardRecentEvent v-for="e in processedEvents" :key="e.index"
        :header="e.event"
        :content="e.phase.toString()"
        :item1="e.index"
      />
      <!-- </div> -->
    <!-- </div> -->

    <!-- {{ types}} -->
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CardRecentEvent from '@/components/shared/CardRecentEvent.vue'

@Component({
  components: {
    CardRecentEvent
  }
})
export default class SingleEventDetail extends Vue {
  private processedEvents: any = [];
  @Prop() private record!: any;

  @Watch('record')
  private processEvents() {
    // console.log('SingleEventDetail -> processEvents -> this.record', this.record);
    this.record.forEach((events:any) => {
      // console.log('SingleEventDetail -> processEvents -> event', events);
      const { event, phase } = events
      const types = event.typeDef
      // console.log('SingleEventDetail -> processEvents -> types', types);
      
      event.data.forEach((data: any, index: any) => {
        // types[index].type
        // console.log('SingleEventDetail -> processEvents -> types[index].type', types[index].type);
        this.processedEvents.push({event, phase, index:`${types[index].type}`, data})
      })
      
    })
  }

  private async mounted() {
    // const { event, phase } = this.record;
    // this.types = this.record.typeDef
    // if (event && event.typeDef) {
    //   const types = event.typeDef
      
    // }
  }
}
</script>

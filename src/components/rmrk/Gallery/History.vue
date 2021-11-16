<template>
 <div class="block">
    <b-collapse class="card" animation="slide"
      aria-id="contentIdForHistory" :open="collapsedHistory">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory">
          <p class="card-header-title">
            {{ $t('History') }}
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <p class="label">
            {{ $t('History') }}
          </p>
          <b-table :data="data" class="mb-4" hoverable>
            <b-table-column
              cell-class="short-identity__table"
              field="Type"
              label="Type"
              v-slot="props"
            >
              {{ props.row.Type }}
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="From"
              label="From"
              v-slot="props"
            >
              <router-link
                :to="{
                  name: 'profile',
                  params: { id: props.row.From },
                }"
              >
                <Identity :address="props.row.From" inline noOverflow />
              </router-link>
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="To"
              label="To"
              v-slot="props"
            >
              <router-link
                :to="{ name: 'profile', params: { id: props.row.To } }"
              >
                <Identity :address="props.row.To" inline noOverflow />
              </router-link>
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="Amount"
              label="Amount"
              v-slot="props"
            >
              {{ props.row.Amount }}
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="Date"
              label="Date"
              v-slot="props"
            >
              {{ props.row.Date }}
            </b-table-column>
          </b-table>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  PriceChart: () => import('@/components/rmrk/Gallery/PriceChart.vue'),
}

@Component({ components })
export default class History extends Vue {
  @Prop() public events!: any;
  protected data: any = [];
  protected collapsedHistory=true;
  // protected eventData: Date[] = [];

  public async mounted() {
    this.collapsedHistory = true

    setTimeout(() => {
      this.collapsedHistory = false
      console.log('here!')
    }, 200)
  }
  protected createTable() {
    let prevOwner = ''
    let curPrice = '0.0000000'
    this.data = []

    for (const newEvent of this.events) {
      const event: any = {}

      // Type
      if (newEvent['interaction'] === 'MINTNFT') {
        event['Type'] = 'CREATE'
        event['From'] = newEvent['caller']
        event['To'] = ''
      } else if (newEvent['interaction'] === 'LIST') {
        event['Type'] = 'SET-PRICE'
        event['From'] = newEvent['caller']
        event['To'] = ''
        prevOwner = event['From']
        curPrice = newEvent['meta']
      } else if (newEvent['interaction'] === 'SEND') {
        event['Type'] = 'GIFT'
        event['From'] = newEvent['caller']
        event['To'] = newEvent['meta']
      } else if (newEvent['interaction'] === 'CONSUME') {
        event['Type'] = 'BURNT'
        event['From'] = newEvent['caller']
        event['To'] = ''
      } else event['Type'] = newEvent['interaction']

      // From
      if (!('From' in event)) event['From'] = prevOwner

      // To
      if (!('To' in event)) {
        event['To'] = newEvent['caller']
        prevOwner = event['To']
      }

      // Amount
      event['Amount'] = Vue.filter('formatBalance')(curPrice, 12, 'KSM')

      // Date
      const date = new Date(newEvent['timestamp'])
      event['Date'] = this.parseDate(date)

      this.data.push(event)
    }

    this.data = this.data.reverse()
  }

  protected parseDate(date: Date) {
    const utcDate: string = date.toUTCString()
    return utcDate.substring(4)
  }

  protected formatDate(date: Date) {
    const yyyy = date.getUTCFullYear()
    const mm = this.padDigits(date.getUTCMonth() + 1)
    const dd = this.padDigits(date.getUTCDate())
    const hrs = this.padDigits(date.getUTCHours())
    const mins = this.padDigits(date.getUTCMinutes())
    const secs = this.padDigits(date.getUTCSeconds())
    const YYYY_MM_DD_HRS_MINS_SECS =
      yyyy + '/' + mm + '/' + dd + '\n' + hrs + ':' +  mins + ':' + secs
    return YYYY_MM_DD_HRS_MINS_SECS
  }

  protected padDigits(time: number) {
    return time.toString().padStart(2, '0')
  }

  protected formatPrice(price: string) {
    return parseFloat(price.substring(0, 6))
  }

  @Watch('events')
  public async watchEvent() {
    if (this.events) {
      this.createTable()
    }
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

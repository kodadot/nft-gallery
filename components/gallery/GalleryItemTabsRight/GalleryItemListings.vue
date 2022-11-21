<template>
  <div class="py-4">
    <!-- <p>{{ nfts }}</p> -->
    <!-- <div v-for="nft in nfts" :key="nft.id">
      <p>{{ nft.name }} - {{ nft.price }} - {{ nft.currentOwner }}</p>
    </div> -->
    <o-table v-if="nfts.length" :data="nfts" hoverable>
      <o-table-column v-slot="props" field="price" label="Unit Price">
        {{ getNftPrice(props.row.id).token }}
      </o-table-column>
      <o-table-column v-slot="props" label="USD Price">
        {{ getNftPrice(props.row.id).usd }}
      </o-table-column>
      <o-table-column v-slot="props" field="currentOwner" label="From">
        <a
          :href="`/${urlPrefix}/u/${props.row.currentOwner}`"
          target="_blank"
          rel="noopener noreferrer">
          <Identity :address="props.row.currentOwner" />
        </a>
      </o-table-column>
      <!-- <o-table-column label=""> Buy > </o-table-column> -->
    </o-table>
  </div>
</template>

<script setup lang="ts">
import { OTable, OTableColumn } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'
import { getKSMUSD } from '@/utils/coingecko'
import formatBalance from '@/utils/formatBalance'

const { urlPrefix } = usePrefix()

const dprops = defineProps<{
  collectionId: string
}>()

const { data } = useGraphql({
  queryName: 'collectionById',
  variables: {
    id: dprops.collectionId,
    first: 10,
    offset: 0, // pagination
    search: [{ price_gt: '0' }],
  },
})

const nfts = ref([])
const nftsPrice = ref({})

watch(data, async () => {
  const ksmPrice = await getKSMUSD()
  // console.log(data.value.collectionEntity.nfts)
  nfts.value = data.value.collectionEntity.nfts

  if (nfts.value.length) {
    nfts.value.forEach(async (nft) => {
      const price = parseFloat(formatBalance(nft.price, undefined, ''))
      nftsPrice.value[nft.id] = {
        usd: `$${parseFloat((price * ksmPrice).toFixed(2))}`,
        token: `${price} KSM`,
      }
    })
  }
})

const getNftPrice = (id) => {
  return nftsPrice.value[id]
}
</script>

<style scoped></style>

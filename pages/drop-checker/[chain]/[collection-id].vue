<template>
  <div>
    <p>Chain: {{ chain }}</p>
    <p>
      Collection page:
      <nuxt-link
        :to="`/${chain}/collection/${collectionId}`"
        target="_blank"
        class="border-b">
        🔗 link
      </nuxt-link>
    </p>
    <p>
      Drop page:
      <nuxt-link
        :to="`/${chain}/drops/${drops.alias}`"
        target="_blank"
        class="border-b">
        🔗 link
      </nuxt-link>
    </p>

    <hr />

    <div class="grid grid-cols-2 gap-6">
      <div>
        <p>Data from database:</p>
        <table v-if="drops" class="table-auto">
          <tr v-for="drop in Object.entries(drops)" :key="drop[0]">
            <td class="align-middle">{{ drop[0] }}</td>
            <td class="align-middle">
              <div v-if="drop[0] === 'image' || drop[0] === 'banner'">
                <img :src="sanitizeIpfsUrl(drop[1].toString())" width="100" />
              </div>
              <div v-else-if="drop[0] === 'content'">
                <iframe
                  :src="sanitizeIpfsUrl(drop[1].toString())"
                  frameborder="0"></iframe>
              </div>
              <div v-else-if="drop[0] === 'price'">
                : {{ formatAmountWithRound(drop[1].toString(), decimals) }}
                {{ chainSymbol }}
              </div>
              <div v-else>: {{ drop[1] }}</div>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <p>Data from indexer:</p>
        <table v-if="collection && collection.meta" class="table-fixed w-full">
          <tr
            v-for="drop in Object.entries(collection)"
            :key="drop[0]"
            :class="{ hidden: drop[0] === 'meta' || drop[0] === '__typename' }">
            <td class="align-middle w-40">{{ drop[0] }}</td>
            <td class="align-middle break-words">
              <div v-if="drop[0] === 'metadata'">
                :
                <NuxtLink
                  class="border-b"
                  :to="sanitizeIpfsUrl(drop[1]?.toString())"
                  target="_blank">
                  🔗 {{ sanitizeIpfsUrl(drop[1]?.toString()) }}
                </NuxtLink>
              </div>
              <div v-else>: {{ drop[1] }}</div>
            </td>
          </tr>
          <tr
            v-for="meta in Object.entries(collection.meta)"
            :key="meta[0]"
            :class="{ hidden: meta[0] === '__typename' }">
            <td class="align-middle w-40">meta.{{ meta[0] }}</td>
            <td class="align-middle break-words">
              <div v-if="meta[0] === 'image'">
                :
                <img :src="sanitizeIpfsUrl(meta[1]?.toString())" width="100" />
              </div>
              <div v-else-if="meta[0] === 'id'">
                :
                <NuxtLink
                  :to="sanitizeIpfsUrl(meta[1]?.toString())"
                  target="_blank"
                  class="border-b">
                  🔗 {{ sanitizeIpfsUrl(meta[1]?.toString()) }}
                </NuxtLink>
              </div>
              <div v-else>: {{ meta[1] }}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <hr />
    <div class="grid grid-cols-8 gap-6">
      <div v-for="n in drops.max" :key="n">
        <NuxtLink
          :to="`${sanitizeIpfsUrl(drops.content)}?hash=${hexOf(n.toString())}`"
          class="block"
          target="_blank">
          <img
            :src="`https://screenshots-r2.koda.art/${extractCid(drops.content)}/${hexOf(n.toString())}.png`"
            width="100%" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keccakAsHex } from '@polkadot/util-crypto'
import collectionById from '~/queries/subsquid/general/collectionById.query'
import { getDrops } from '~/services/fxart'
import { formatAmountWithRound } from '~/utils/format/balance'

const { params } = useRoute()
const chain = params.chain.toString()
const collectionId = params['collectionid'].toString()

// get data from database
const data = await getDrops({
  chain: [chain],
  limit: 10,
})
const drops = data.filter((drop) => drop.collection === collectionId)[0]

const { chainSymbol, decimals } = useChain()

// get data from indexer
const { client } = usePrefix()
const { data: indexer } = useAsyncQuery({
  query: collectionById,
  variables: {
    id: collectionId,
  },
  clientId: client.value,
})
const collection = computed(() => {
  const entity = indexer.value?.collectionEntity
  // @ts-expect-error force delete unused data
  delete entity?.nfts

  return entity
})

// sn to hex
function hexOf(text: string): string {
  return keccakAsHex(text)
}
</script>

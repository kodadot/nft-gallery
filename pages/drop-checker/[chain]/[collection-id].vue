<template>
  <div class="font-mono">
    <p>Chain: {{ chain }}</p>
    <table class="table-fixed">
      <thead>
        <tr>
          <th class="text-k-primary w-60">
            Key
          </th>
          <th />
          <th class="text-k-primary">
            Value
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Collection page</td>
          <td>:&nbsp;</td>
          <td>
            <nuxt-link
              :to="`/${chain}/collection/${collectionId}`"
              target="_blank"
              class="border-b"
            >
              🔗 link
            </nuxt-link>
          </td>
        </tr>
        <tr>
          <td>Collection name</td>
          <td>:&nbsp;</td>
          <td>{{ metadata?.name }}</td>
        </tr>
        <tr>
          <td>Collection description</td>
          <td>:&nbsp;</td>
          <td>{{ metadata?.description }}</td>
        </tr>
        <tr>
          <td>
            <neo-icon
              v-if="collectionConfig?.maxSupply === drops.max?.toString()"
              icon="check"
              class="text-k-green"
            />
            <neo-icon
              v-else
              icon="xmark"
              class="text-k-red"
            />
            Collection supply
          </td>
          <td>:&nbsp;</td>
          <td>
            <p>on-chain: {{ collectionConfig?.maxSupply }}</p>
            <p>database: {{ drops.max }}</p>
          </td>
        </tr>
        <tr>
          <td>
            <neo-icon
              v-if="collectionConfig?.mintSettings.price === drops.price"
              icon="check"
              class="text-k-green"
            />
            <neo-icon
              v-else
              icon="xmark"
              class="text-k-red"
            />
            Collection price
          </td>
          <td>:&nbsp;</td>
          <td>
            <p>
              on-chain:
              {{
                formatAmountWithRound(
                  collectionConfig?.mintSettings?.price || '',
                  decimals,
                )
              }}
              {{ chainSymbol }}
            </p>
            <p>
              database: {{ formatAmountWithRound(drops.price || '', decimals) }}
              {{ chainSymbol }}
            </p>
          </td>
        </tr>
        <tr>
          <td>Collection image</td>
          <td>:&nbsp;</td>
          <td>
            <img
              :src="sanitizeIpfsUrl(metadata?.image)"
              width="100"
            >
          </td>
        </tr>
        <tr>
          <td>Collection generative</td>
          <td>:&nbsp;</td>
          <td>
            <iframe
              v-if="metadata?.generative_uri"
              :src="sanitizeIpfsUrl(metadata?.generative_uri)"
              frameborder="0"
              :title="metadata?.name"
            />
            <neo-icon
              v-else
              icon="xmark"
              class="text-k-red"
            />
          </td>
        </tr>
        <tr>
          <td>Drop page</td>
          <td>:&nbsp;</td>
          <td>
            <nuxt-link
              :to="`/${chain}/drops/${drops.alias}`"
              target="_blank"
              class="border-b"
            >
              🔗 link
            </nuxt-link>
          </td>
        </tr>
        <tr>
          <td>Drop type</td>
          <td>:&nbsp;</td>
          <td>
            {{ drops.type }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- thumbnails section -->
    <hr>
    <p>Thumbnails:</p>
    <div class="grid grid-cols-8 gap-6">
      <div
        v-for="n in client === 'ahp'
          ? parseInt(collectionConfig?.maxSupply || '32')
          : 32"
        :key="n"
      >
        <NuxtLink
          :to="`${sanitizeIpfsUrl(drops.content)}?hash=${hexOf(n.toString())}`"
          class="block"
          target="_blank"
        >
          <img
            :src="`https://screenshots-r2.koda.art/${extractCid(drops.content)}/${hexOf(n.toString())}.png`"
            width="100%"
          >
        </NuxtLink>
      </div>
    </div>

    <!-- Debug mode section -->
    <hr>
    <neo-collapse :open="false">
      <template #trigger>
        <neo-button
          label="debug mode"
          variant="primary"
        />
      </template>
      <div class="grid grid-cols-2 gap-6 mt-6">
        <div>
          <p>Data from database:</p>
          <table
            v-if="drops"
            class="table-auto"
          >
            <thead>
              <tr>
                <th class="text-k-primary">
                  Key
                </th>
                <th class="text-k-primary">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="drop in Object.entries(drops)"
                :key="drop[0]"
              >
                <td class="align-middle">
                  {{ drop[0] }}
                </td>
                <td class="align-middle">
                  <div v-if="drop[0] === 'image' || drop[0] === 'banner'">
                    <img
                      :src="sanitizeIpfsUrl(drop[1].toString())"
                      width="100"
                    >
                  </div>
                  <div v-else-if="drop[0] === 'content'">
                    <iframe
                      :src="sanitizeIpfsUrl(drop[1].toString())"
                      frameborder="0"
                      title="genart"
                    />
                  </div>
                  <div v-else-if="drop[0] === 'price'">
                    : {{ formatAmountWithRound(drop[1].toString(), decimals) }}
                    {{ chainSymbol }}
                  </div>
                  <div v-else>
                    : {{ drop[1] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p>Data from indexer:</p>
          <table
            v-if="collection && collection.meta"
            class="table-fixed w-full"
          >
            <thead>
              <tr>
                <th class="text-k-primary">
                  Key
                </th>
                <th class="text-k-primary">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="drop in Object.entries(collection)"
                :key="drop[0]"
                :class="{
                  hidden: drop[0] === 'meta' || drop[0] === '__typename',
                }"
              >
                <td class="align-middle w-40">
                  {{ drop[0] }}
                </td>
                <td class="align-middle break-words">
                  <div v-if="drop[0] === 'metadata'">
                    :
                    <NuxtLink
                      class="border-b"
                      :to="sanitizeIpfsUrl(drop[1]?.toString())"
                      target="_blank"
                    >
                      🔗 {{ sanitizeIpfsUrl(drop[1]?.toString()) }}
                    </NuxtLink>
                  </div>
                  <div v-else>
                    : {{ drop[1] }}
                  </div>
                </td>
              </tr>
              <tr
                v-for="meta in Object.entries(collection.meta)"
                :key="meta[0]"
                :class="{ hidden: meta[0] === '__typename' }"
              >
                <td class="align-middle w-40">
                  meta.{{ meta[0] }}
                </td>
                <td class="align-middle break-words">
                  <div v-if="meta[0] === 'image'">
                    :
                    <img
                      :src="sanitizeIpfsUrl(meta[1]?.toString())"
                      width="100"
                    >
                  </div>
                  <div v-else-if="meta[0] === 'id'">
                    :
                    <NuxtLink
                      :to="sanitizeIpfsUrl(meta[1]?.toString())"
                      target="_blank"
                      class="border-b"
                    >
                      🔗 {{ sanitizeIpfsUrl(meta[1]?.toString()) }}
                    </NuxtLink>
                  </div>
                  <div v-else>
                    : {{ meta[1] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </neo-collapse>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoCollapse, NeoIcon } from '@kodadot1/brick'
import { keccakAsHex } from '@polkadot/util-crypto'
import type { Prefix } from '@kodadot1/static'
import collectionById from '@/queries/subsquid/general/collectionById.query'
import { getDrops } from '@/services/fxart'
import { formatAmountWithRound } from '@/utils/format/balance'

const { params } = useRoute()
const chain = params.chain.toString()
const collectionId = params['collectionid'].toString()

const { chainSymbol, decimals } = useChain()

// get data from database
const drops = (
  await getDrops({
    chain: [chain],
    collection: collectionId,
  })
)[0]

// get data from indexer
const { client, setUrlPrefix } = usePrefix()
setUrlPrefix(chain as Prefix)
const { data: indexer } = useAsyncQuery({
  query: collectionById,
  variables: {
    id: collectionId,
  },
  clientId: chain,
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

// get data from metadata
const metadata = ref<{
  name: string
  description: string
  image: string
  generative_uri: string
}>()
watchEffect(async () => {
  if (collection.value?.metadata) {
    metadata.value = await $fetch(
      sanitizeIpfsUrl(collection.value?.metadata || ''),
    )
  }
})

// get data from on-chain
type Config = {
  maxSupply: string
  mintSettings: {
    price: string
  }
}
const collectionConfig = ref<Config>()
watchEffect(async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const config = await api.query.nfts.collectionConfigOf(collectionId)
  collectionConfig.value = config.toHuman() as Config
  collectionConfig.value.maxSupply
    = collectionConfig.value.maxSupply?.replaceAll(',', '')
  collectionConfig.value.mintSettings.price
    = collectionConfig.value.mintSettings.price?.replaceAll(',', '')
})
</script>

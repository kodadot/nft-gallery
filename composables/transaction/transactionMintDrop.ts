import { GENSOL_ABI } from './evm/utils'
import type {
  EvmMintDropParams,
  MintDropParams,
  SubstrateMintDropParams,
} from './types'
import { useDrop } from '@/components/drops/useDrops'

function execAssethubMintDrop({
  item,
  api,
  executeTransaction,
  isLoading,
}: SubstrateMintDropParams) {
  const { drop } = useDrop()
  const { toMintNFTs } = storeToRefs(useDropStore())
  const { accountId } = useAuth()
  const nftsMetadata = computed(() => {
    return toMintNFTs.value.map((nft) => {
      return {
        chain: drop.value.chain,
        collection: drop.value.collection,
        metadata: nft.metadata,
      }
    })
  })

  const args = toMintNFTs.value.map((allocatedNft, index) =>
    api.tx.nfts.mint(item.collectionId, allocatedNft.nft, accountId.value, {
      ownedItem: (item.availableSerialNumbers || [])[index] || null,
      mintPrice: item.price || null,
    }),
  )
  args.push(api.tx.system.remark(JSON.stringify(nftsMetadata.value)))
  isLoading.value = true

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [args],
  })
}

async function execEvmMintDrop({ executeTransaction }: EvmMintDropParams) {
  const { accountId } = useAuth()
  const { drop } = useDrop()

  executeTransaction({
    address: drop.value.collection,
    abi: GENSOL_ABI,
    arg: [accountId.value],
    functionName: 'safeMint',
    value: drop.value.price,
  })
}

export function execMintDrop({ item, ...params }: MintDropParams) {
  if (item.prefix === 'ahk' || item.prefix === 'ahp') {
    return execAssethubMintDrop({
      item,
      ...params,
    } as SubstrateMintDropParams)
  }

  if (isEvm(item.prefix)) {
    return execEvmMintDrop({
      item,
      ...params,
    })
  }
}

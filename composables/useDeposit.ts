import type { Prefix } from '@kodadot1/static'
import { ComputedRef } from 'vue/types'

type Props = {
  prefix: ComputedRef<Prefix>
}

export default function ({ prefix }: Props) {
  const { apiInstanceByPrefix } = useApi()

  const balance = ref()

  const collectionDeposit = ref(0)
  const itemDeposit = ref(0)
  const metadataDeposit = ref(0)

  const isKusama = computed(
    () => prefix.value === 'ksm' || prefix.value === 'rmrk'
  )
  const isBasilisk = computed(
    () => prefix.value === 'bsx' || prefix.value === 'snek'
  )
  const isAssetHub = computed(
    () => prefix.value === 'ahk' || prefix.value === 'ahp'
  )

  watchEffect(async () => {
    if (prefix.value) {
      const api = await apiInstanceByPrefix(prefix.value)

      // set deposit amount
      if (isAssetHub.value) {
        collectionDeposit.value = api.consts.nfts.collectionDeposit.toNumber()
        itemDeposit.value = api.consts.nfts.itemDeposit.toNumber()
        metadataDeposit.value = api.consts.nfts.metadataDepositBase.toNumber()
      }

      if (isBasilisk.value) {
        collectionDeposit.value =
          api.consts.uniques.collectionDeposit.toNumber()
        itemDeposit.value = api.consts.uniques.collectionDeposit.toNumber()
        metadataDeposit.value =
          api.consts.uniques.metadataDepositBase.toNumber()
      }

      // get chain default symbol
    }
  })

  return {
    collectionDeposit,
    itemDeposit,
    metadataDeposit,
  }
}

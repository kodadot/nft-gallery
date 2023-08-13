import { useAssetsStore } from '~/stores/assets'

export default function () {
  const assetIdOf = (id: string | number) => {
    return useAssetsStore().getAssetById(String(id))
  }

  return {
    assetIdOf,
  }
}

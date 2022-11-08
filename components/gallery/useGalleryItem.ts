import { NftEntity } from '@/components/rmrk/service/types'
import { sanitizeIpfsUrl } from '../rmrk/utils'

export const useGalleryItem = () => {
  const { $route } = useNuxtApp()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'nftById',
    variables: {
      id: $route.params.id,
    },
  })
  const nft = ref<NftEntity>()

  const handleResult = ({ data }) => {
    nft.value = {
      ...data.nftEntity,
      image: sanitizeIpfsUrl(data.nftEntity.meta.image),
    }
  }

  watch(data, () => {
    if (data.value) {
      handleResult({ data: data.value })
    }
  })

  return {
    nft,
  }
}

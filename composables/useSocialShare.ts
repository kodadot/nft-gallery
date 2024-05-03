import type { Prefix } from '@kodadot1/static'
import { URLS } from '@/utils/constants'

export default function () {
  const route = useRoute()

  const fullPathShare = ref(`${window.location.origin}${route.fullPath}`)

  const open = (url: string) => {
    window.open(url, '_blank')
  }

  const shareOnX = (
    text: string,
    url: string = fullPathShare.value,
    via: string = 'KodaDot',
  ) => {
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&via=${via}&url=${url}`,
    )
  }

  const shareOnTelegram = (text: string, url: string = fullPathShare.value) => {
    open(
      `https://t.me/share/url?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(text)}`,
    )
  }

  const shareOnFarcaster = (
    text: string,
    urls: string[] = [fullPathShare.value],
  ) => {
    open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&${urls.map((url) => `embeds[]=${encodeURIComponent(url)}`).join('&')}`,
    )
  }

  const getCollectionFrameUrl = (chain: Prefix, collectionId: string) =>
    `${URLS.koda.frame}/${chain}/${collectionId}/246`

  const shareCollectionOnFarcaster = (
    chain: Prefix,
    collectionId: string,
    text: string,
  ) => {
    shareOnFarcaster(text, [getCollectionFrameUrl(chain, collectionId)])
  }

  return {
    shareOnX,
    shareOnTelegram,
    shareOnFarcaster,
    shareCollectionOnFarcaster,
    getCollectionFrameUrl,
  }
}

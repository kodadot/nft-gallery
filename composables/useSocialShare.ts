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
    url: string = fullPathShare.value,
  ) => {
    open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(
        text,
      )}&embeds[]=${url}`,
    )
  }

  const shareCollectionOnFarcaster = (
    chain: Prefix,
    collectionId: string,
    text: string,
  ) => {
    shareOnFarcaster(text, `${URLS.koda.frame}/${chain}/${collectionId}`)
  }

  return {
    shareOnX,
    shareOnTelegram,
    shareOnFarcaster,
    shareCollectionOnFarcaster,
  }
}

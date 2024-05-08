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
    const shareUrl = new URL('https://twitter.com/intent/tweet')
    shareUrl.searchParams.set('text', text)
    shareUrl.searchParams.set('via', via)
    shareUrl.searchParams.set('url', url)
    open(shareUrl.toString())
  }

  const shareOnTelegram = (text: string, url: string = fullPathShare.value) => {
    const shareUrl = new URL('https://t.me/share/url')
    shareUrl.searchParams.set('url', url)
    shareUrl.searchParams.set('text', text)
    open(shareUrl.toString())
  }

  const shareOnFarcaster = (
    text: string,
    embeds: string[] = [fullPathShare.value],
  ) => {
    const url = new URL('https://warpcast.com/~/compose')
    url.searchParams.set('text', text)
    embeds.forEach((embed) => url.searchParams.append('embeds[]', embed))
    open(url.toString())
  }

  const getCollectionFrameUrl = (chain: Prefix, collectionId: string) =>
    `${URLS.koda.frame}/${chain}/${collectionId}`

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

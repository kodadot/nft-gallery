export default function () {
  const route = useRoute()

  const realworldFullPathShare = ref(
    `${window.location.origin}${route.fullPath}`,
  )

  const open = (url: string) => {
    window.open(url, '_blank')
  }

  const shareOnX = (
    text: string,
    url: string = realworldFullPathShare.value,
  ) => {
    open(`https://twitter.com/intent/tweet?text=${text}&via=KodaDot&url=${url}`)
  }

  const shareOnTelegram = (
    text: string,
    url: string = realworldFullPathShare.value,
  ) => {
    open(
      `https://t.me/share/url?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(text)}`,
    )
  }

  return { shareOnX, shareOnTelegram }
}

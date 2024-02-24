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
    via: string = 'KodaDot',
  ) => {
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&via=${via}&url=${url}`,
    )
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

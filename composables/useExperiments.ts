export default function () {
  const searchParams = new URLSearchParams(window.location.search)

  const has = (key: string) =>
    searchParams.get(key) === 'true' || localStorage.getItem(key) === 'true'

  // poc by using unique id. ref: https://github.com/kodadot/private-workers/issues/87#issuecomment-1997444473
  const route = useRoute()
  const pocDrops = ['/ahk/drops/pills', '/ahk/drops/monotifs']
  const flagUid = computed(() => {
    return has('uid') || pocDrops.includes(route.path)
  })

  return {
    redesign: computed(() => has('redesign')),
    flagUid,
  }
}

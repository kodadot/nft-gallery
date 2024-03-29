export default function () {
  const searchParams = new URLSearchParams(window.location.search)

  const has = (key: string) =>
    searchParams.get(key) === 'true' || localStorage.getItem(key) === 'true'

  return {
    redesign: computed(() => has('redesign')),
    flagAutoTeleport: computed(() => has('autoTeleport')), // disable auto teleport by default. can be enabled by query param or local storage. to test it internally
  }
}

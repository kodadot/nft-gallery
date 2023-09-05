export default function () {
  const searchParams = new URLSearchParams(window.location.search)

  const has = (key: string) =>
    searchParams.get(key) === 'true' || localStorage.getItem(key) === 'true'

  return {
    redesign: computed(() => has('redesign')),
  }
}

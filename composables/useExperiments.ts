export default function () {
  const searchParams =
    process.client && new URLSearchParams(window.location.search)

  const has = (key: string) =>
    searchParams.get(key) === 'true' ||
    (process.client && localStorage.getItem(key) === 'true')

  return {
    redesign: computed(() => has('redesign')),
  }
}

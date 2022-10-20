export default function () {
  const searchParams = new URLSearchParams(window.location.search)

  return {
    redesign: computed(() => searchParams.get('redesign') === 'true'),
  }
}

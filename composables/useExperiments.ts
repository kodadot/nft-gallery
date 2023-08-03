export default function () {
  const searchParams = new URLSearchParams(window.location.search)

  return {
    redesign: computed(
      () =>
        searchParams.get('redesign') === 'true' ||
        localStorage.getItem('redesign') === 'true' ||
        searchParams.get('edge') === 'true'
    ),
  }
}

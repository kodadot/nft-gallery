export const getFakeEmail = () => {
  const crypto = window.crypto
  const array = new Uint32Array(1)
  return `${crypto.getRandomValues(array).toString()}@example.com`
}

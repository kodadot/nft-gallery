export const getFakeEmail = () => {
  const crypto = window.crypto
  const array = new Uint32Array(1)
  return `${crypto.getRandomValues(array).toString()}@example.com`
}

export const allocateRaffle = async (): Promise<{ raffleId: number }> => {
  const { metadata, hash } = await getImageInfo(selectedImage.value)
  const body = {
    email: getFakeEmail(),
    hash,
    address: accountId.value,
    image: selectedImage.value,
    metadata: metadata,
  }

  const response = await allocateCollection(body, drop.value.id)
  return { raffleId: parseInt(response.result.id) }
}

export const postCodeToIframe = (code: string) => {
  const sketchIframe = document.getElementById(
    'sketch-iframe',
  ) as HTMLIFrameElement
  if (sketchIframe?.contentWindow) {
    // Include the hash in the message
    const message = {
      code,
    }
    sketchIframe.contentWindow.postMessage(
      JSON.stringify(message),
      window.location.origin,
    )
  }
}

export const generateRandomHash = async (
  algorithm: AlgorithmIdentifier = 'SHA-1',
) => {
  const randomValue = window.crypto
    .getRandomValues(new Uint8Array(20))
    .toString()

  const encoder = new TextEncoder()
  const data = encoder.encode(randomValue)

  const hashBuffer = await window.crypto.subtle.digest(algorithm, data)

  // Convert the buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

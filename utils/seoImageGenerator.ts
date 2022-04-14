export const generateNftImage = (
  name: string,
  price: string,
  image: string,
  mimeType = ''
): string => {
  return `https://og-image-green-seven.vercel.app/${encodeURIComponent(
    name
  )}.jpeg?price=${price}&image=${image}&mime=${mimeType}`
}

export const generateCollectionImage = (
  name: string,
  itemCount: string | number,
  image: string
) => {
  return generateNftImage(name, `Items:${itemCount}`, image)
}

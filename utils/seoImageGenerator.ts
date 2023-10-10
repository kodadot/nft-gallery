import { URLS } from './constants'

export const generateNftImage = (
  name: string,
  price: string,
  image: string,
  mimeType = '',
): string => {
  const searchParams = new URLSearchParams()
  price && searchParams.set('price', price)
  image && searchParams.set('image', image)
  mimeType && searchParams.set('mime', mimeType)

  console.log({ name, price, image, mimeType })
  console.log(
    `${URLS.koda.seoCard}${encodeURIComponent(
      name,
    )}.jpeg?${searchParams.toString()}`,
  )
  return `${URLS.koda.seoCard}${encodeURIComponent(
    name,
  )}.jpeg?${searchParams.toString()}`
}

export const generateCollectionImage = (
  name: string,
  itemCount: string | number,
  image: string,
) => {
  return generateNftImage(name, `Items:${itemCount}`, image)
}

export const generateDropImage = (name: string, image: string) => {
  return generateNftImage(name, '', image)
}

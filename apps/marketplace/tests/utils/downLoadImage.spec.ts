import { downloadImage } from '@/utils/download'
const MOCK_IMAGE_URL = 'https://www.test.com/'

global.fetch = vitest.fn(() =>
  Promise.resolve({
    blob: () => 'imageBlog',
  })
)
global.URL = {
  createObjectURL: () => MOCK_IMAGE_URL,
}
global.document = window.document

describe('DOWNLOAD TEST', (): void => {
  it('TEST downloadImage', async () => {
    const link = await downloadImage(MOCK_IMAGE_URL, 'nftName')
    expect(link.tagName).toBe('A')
    expect(link.download).toBe('nftName')
    expect(link.href).toBe(MOCK_IMAGE_URL)
  })
  it('TEST downloadImage fail', async () => {
    const link = await downloadImage('', 'nftName')
    expect(link).toBeUndefined()
  })
})

import { removeSuffixFromString } from '@/utils/parse'

export const DESCRIPTION_MAX_LENGTH = 210

export const generatePreviewDescription = (content: string = '') => {
  return (
    removeSuffixFromString(
      content?.slice(0, DESCRIPTION_MAX_LENGTH),
    )?.replaceAll('\n', '  \n') + '...'
  )
}

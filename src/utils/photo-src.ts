import type {PhotoImageType} from '../types/photo.types'

const baseUrl = () => process.env.PHOTOS_BASE_URL ?? ''

export function photoUrl(
  photo: PhotoImageType,
  width: number,
  ext: 'avif' | 'jpg',
) {
  return `${baseUrl()}/${photo.storage_prefix}/${width}.${ext}`
}

function usableWidths(widths: number[], maxWidth?: number) {
  if (!maxWidth) return widths

  const target = maxWidth * 2
  const index = widths.findIndex(w => w >= target)

  return index === -1 ? widths : widths.slice(0, index + 1)
}

export function photoSrcset(
  photo: PhotoImageType,
  ext: 'avif' | 'jpg',
  maxWidth?: number,
) {
  return usableWidths(photo.widths, maxWidth)
    .map(w => `${photoUrl(photo, w, ext)} ${w}w`)
    .join(', ')
}

export function photoFallbackWidth(photo: PhotoImageType, maxWidth?: number) {
  const widths = usableWidths(photo.widths, maxWidth)

  return widths[widths.length - 1]
}

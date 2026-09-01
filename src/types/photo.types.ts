// the columns any <Photo /> needs to render; queries that only build an image
// (covers, homepage thumbs) select this subset instead of the whole row
export type PhotoImageType = {
  id: string
  storage_prefix: string
  width: number
  height: number
  widths: number[]
  placeholder: string | null
}

export type PhotoType = PhotoImageType & {
  caption: string | null
  favorites: number
  taken_at: string | null
  focal_length_mm: string | null
  aperture: string | null
  shutter_speed: string | null
  iso: number | null
  camera_model: string | null
  lens_model: string | null
}

export type LatestPhotoType = PhotoImageType & {
  caption: string | null
  collection_slug: string
  collection_title: string
}

export type PhotoCollectionType = {
  id: string
  slug: string
  title: string
  description: string | null
  location: string | null
  created_at: string
  photo_count?: number
  cover?: PhotoImageType | null
  photos?: PhotoType[]
}

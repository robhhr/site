import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getPublishedCollections({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT c.id, c.slug, c.title, c.description, c.location, c.created_at,
           COUNT(p.id)::int AS photo_count,
           (
             SELECT row_to_json(cover)
             FROM (
               SELECT id, storage_prefix, width, height, widths, placeholder
               FROM photos
               WHERE collection_id = c.id AND is_published = true
               ORDER BY sort_index, created_at
               LIMIT 1
             ) cover
           ) AS cover
    FROM photo_collections c
    LEFT JOIN photos p ON p.collection_id = c.id AND p.is_published = true
    WHERE c.is_published = true
    GROUP BY c.id
    HAVING COUNT(p.id) > 0
    ORDER BY c.created_at DESC
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

// photos are always read through their collection so an unpublished album
// can't leak, even while collections aren't surfaced in the ui.
const fromPublishedPhotos = `
  FROM photos p
  JOIN photo_collections c ON c.id = p.collection_id
  WHERE p.is_published = true AND c.is_published = true
  ORDER BY p.created_at DESC, p.id
`

// homepage grid: thumbnails only, so no exif or favorites columns
export async function getLatestPhotos({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT p.id, p.storage_prefix, p.width, p.height, p.widths, p.placeholder,
           p.caption, c.slug AS collection_slug, c.title AS collection_title
    ${fromPublishedPhotos}
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

// /photos feed: full rows, every photo across every collection
export async function getPublishedPhotos({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT p.id, p.storage_prefix, p.width, p.height, p.widths, p.placeholder,
           p.caption, p.favorites, p.taken_at, p.focal_length_mm, p.aperture,
           p.shutter_speed, p.iso, p.camera_model, p.lens_model
    ${fromPublishedPhotos}
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

export async function getCollectionBySlug(slug: string) {
  const collectionSql = `
    SELECT id, slug, title, description, location, created_at
    FROM photo_collections
    WHERE slug = $1 AND is_published = true
  `
  const collection = await tryCatch(query(collectionSql, [slug]))

  if (collection.error) {
    console.error(collection.error)
    return null
  }

  if (!collection.data.rows[0]) return null

  const photosSql = `
    SELECT id, storage_prefix, width, height, widths, placeholder, caption,
           favorites, taken_at, focal_length_mm, aperture, shutter_speed, iso,
           camera_model, lens_model
    FROM photos
    WHERE collection_id = $1 AND is_published = true
    ORDER BY sort_index, created_at
  `
  const photos = await tryCatch(query(photosSql, [collection.data.rows[0].id]))

  if (photos.error) {
    console.error(photos.error)
    return null
  }

  return {...collection.data.rows[0], photos: photos.data.rows}
}

export async function incrementFavorites(photoId: string) {
  const sql = `
    UPDATE photos
    SET favorites = favorites + 1, updated_at = now()
    WHERE id = $1
    RETURNING favorites
  `
  const result = await tryCatch(query(sql, [photoId]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]?.favorites
}

export async function decrementFavorites(photoId: string) {
  const sql = `
    UPDATE photos
    SET favorites = GREATEST(favorites - 1, 0), updated_at = now()
    WHERE id = $1
    RETURNING favorites
  `
  const result = await tryCatch(query(sql, [photoId]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]?.favorites
}

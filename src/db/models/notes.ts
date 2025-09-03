import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getNotes({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT n.id, n.title, n.slug, n.status, n.is_pinned, n.favorites, n.created_at, n.updated_at,
           COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), '{}') as tags
    FROM notes n
    LEFT JOIN notes_tags nt ON n.id = nt.note_id
    LEFT JOIN tags tg ON nt.tag_id = tg.id
    WHERE n.status = 'publish'
    GROUP BY n.id, n.title, n.slug, n.status, n.is_pinned, n.favorites, n.created_at, n.updated_at
    ORDER BY n.created_at DESC
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

export async function getNoteBySlug(slug: string) {
  const sql = `
    SELECT n.id, n.title, n.slug, n.content, n.status, n.is_pinned, n.favorites, n.created_at, n.updated_at,
           COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), '{}') as tags
    FROM notes n
    LEFT JOIN notes_tags nt ON n.id = nt.note_id
    LEFT JOIN tags tg ON nt.tag_id = tg.id
    WHERE n.slug = $1
    GROUP BY n.id, n.title, n.slug, n.content, n.status, n.is_pinned, n.favorites, n.created_at, n.updated_at
  `
  const result = await tryCatch(query(sql, [slug]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]
}

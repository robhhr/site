import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getThoughts({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT t.id, t.content, t.is_pinned, t.favorites, t.created_at, t.updated_at,
           COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), '{}') as tags
    FROM thoughts t
    LEFT JOIN thought_tags tt ON t.id = tt.thought_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.status = 'publish'
    GROUP BY t.id, t.content, t.is_pinned, t.favorites, t.created_at, t.updated_at
    ORDER BY t.created_at DESC
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

export async function incrementFavorites(thoughtId: string) {
  const sql = `
    UPDATE thoughts
    SET favorites = favorites + 1, updated_at = now()
    WHERE id = $1
    RETURNING favorites
  `
  const result = await tryCatch(query(sql, [thoughtId]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]?.favorites
}

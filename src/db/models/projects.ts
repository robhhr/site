import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getProjects({limit}: {limit?: number} = {}) {
  const sql = `SELECT * FROM projects WHERE status = 'publish' ORDER BY created_at DESC LIMIT $1`
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

export async function getProjectBySlug(slug: string) {
  const result = await tryCatch(
    query('SELECT * FROM projects WHERE slug = $1', [slug]),
  )

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]
}

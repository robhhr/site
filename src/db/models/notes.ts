import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getNotes({limit}: {limit?: number} = {}) {
  const sql = `SELECT * FROM notes WHERE status = 'publish' ORDER BY created_at DESC LIMIT $1`
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

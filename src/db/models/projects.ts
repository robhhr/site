import {query} from '../db'
import {tryCatch} from '../../utils/try-catch'

export async function getProjects({limit}: {limit?: number} = {}) {
  const sql = `
    SELECT p.id, p.title, p.slug, p.status, p.metadata, p.created_at, p.updated_at,
           COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), '{}') as tags
    FROM projects p
    LEFT JOIN projects_tags pt ON p.id = pt.project_id
    LEFT JOIN tags tg ON pt.tag_id = tg.id
    WHERE p.status = 'publish'
    GROUP BY p.id, p.title, p.slug, p.status, p.metadata, p.created_at, p.updated_at
    ORDER BY p.created_at DESC
    LIMIT $1
  `
  const result = await tryCatch(query(sql, [limit]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows
}

export async function getProjectBySlug(slug: string) {
  const sql = `
    SELECT p.id, p.title, p.slug, p.content, p.status, p.metadata, p.created_at, p.updated_at,
           COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), '{}') as tags
    FROM projects p
    LEFT JOIN projects_tags pt ON p.id = pt.project_id
    LEFT JOIN tags tg ON pt.tag_id = tg.id
    WHERE p.slug = $1
    GROUP BY p.id, p.title, p.slug, p.content, p.status, p.metadata, p.created_at, p.updated_at
  `
  const result = await tryCatch(query(sql, [slug]))

  if (result.error) {
    console.error(result.error)
    return null
  }

  return result.data.rows[0]
}

export type NoteType = {
  id: number
  title: string
  content: string
  favorites: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  tags?: string[]
}

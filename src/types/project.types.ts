export type MetadataType = {
  label: string
  value: string
  showAdditional: boolean
  additionalValues: string[]
}

export type ProjectType = {
  id: number
  title: string
  slug: string
  content: string
  metadata: MetadataType[]
  created_at: string
  updated_at: string
  tags?: string[]
}

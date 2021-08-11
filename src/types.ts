export type MetaData = {
  title: string
  date: string
  fileName: string
  id: string
  // description: string
  // iconPath: string
}

export type Post = {
  meta: MetaData
  content: string
}

import { MetaData } from '../types'

export const getContent = (markdown: string): string => {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown)
  if (!match) return ''
  const content = markdown.slice(match[0].length)
  return content
}

export const getMetaData = (markdown: string): MetaData => {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown)
  if (!match) return {} as MetaData
  const frontMatter = match[1]
  const metadata = {} as MetaData
  frontMatter.split('\n').forEach((pair) => {
    const colonIndex = pair.indexOf(':')
    metadata[pair.slice(0, colonIndex).trim() as keyof MetaData] = pair
      .slice(colonIndex + 1)
      .trim()
  })
  return metadata
}

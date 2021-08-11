import { readdir, readFile, writeFile } from 'fs/promises'
import yargs from 'yargs'
import path from 'path'
// import markdownHtml from 'zenn-markdown-html'

type MetadataType = {
  title: string
  date: string
  fileName: string
  // description: string
  // iconPath: string
}

function getContent(markdown: string): string {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown)
  if (!match) return ''
  const content = markdown.slice(match[0].length)
  return content
}

function getMetaData(markdown: string): MetadataType {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown)
  if (!match) return {} as MetadataType
  const frontMatter = match[1]
  const metadata = {} as MetadataType
  frontMatter.split('\n').forEach((pair) => {
    const colonIndex = pair.indexOf(':')
    metadata[pair.slice(0, colonIndex).trim() as keyof MetadataType] = pair
      .slice(colonIndex + 1)
      .trim()
  })
  return metadata
}

const main = async () => {
  // argsを読み取り
  const args = yargs(process.argv)
  // postsのファイルパス一覧取得
  // TODO: エラーハンドリング
  const postNames = await readdir(path.resolve(__dirname, '../doc/posts'))

  // postsの内容を取得
  const posts = await Promise.all(
    postNames.map(async (fileName) => {
      const post = await readFile(
        path.resolve(__dirname, '../doc/posts', fileName),
        'utf-8'
      )
      return {
        meta: { ...getMetaData(post), fileName },
        constn: getContent(post),
      }
    })
  )

  // index.htmlを作成
  // テンプレート取得
  const indexTemplate = await readFile(
    path.resolve(__dirname, '../doc/template/index.html'),
    'utf-8'
  )
  const postListDom = posts.map((post) => {
    return `<li><a href="${post.meta.fileName}">${post.meta.title}</a></li>`
  })
  // contentsをhtmlに変換
  const indexHtml = indexTemplate
    .replace('{title}', '投稿一覧')
    .replace('{body}', `<ul>${postListDom.join('')}</ul>`)

  // index.htmlを書き込み
  await writeFile(path.resolve(__dirname, '../dist/index.html'), indexHtml)

  // posts/${id}.htmlを作成
}

;(async () => {
  await main()
})()

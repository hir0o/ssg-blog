import { readdir, readFile, writeFile } from 'fs/promises'
import yargs from 'yargs'
import markdownHtml from 'zenn-markdown-html'
import { getFullPath } from './lib/path'
import { getMetaData, getContent } from './lib/post'
import { Post } from './types'
import { Index } from './template/index'

const main = async () => {
  // argsを読み取り
  const args = yargs(process.argv)
  // postsのファイルパス一覧取得
  // TODO: エラーハンドリング
  const postNames = await readdir(getFullPath('../doc/posts/'))

  // postsの内容を取得
  const posts: Post[] = await Promise.all(
    postNames.map(async (fileName) => {
      const post = await readFile(
        getFullPath('../doc/posts', fileName),
        'utf-8'
      )
      return {
        meta: { ...getMetaData(post), id: fileName.replace('.md', '') },
        content: getContent(post),
      }
    })
  )

  // index.htmlを書き込み
  await writeFile(
    getFullPath('../dist/index.html'),
    Index({ title: '投稿一覧', posts })
  )

  // posts/${id}.htmlを作成
  const postTemplate = await readFile(
    getFullPath('./template/posts.html'),
    'utf-8'
  )

  // TODO: posts/ がなかったら作成する
  posts.forEach(async (post) => {
    const contentHtml = markdownHtml(post.content)
    const postHtml = postTemplate
      .replace('{title}', post.meta.title)
      .replace('{body}', contentHtml)
    await writeFile(getFullPath(`../dist/posts/${post.meta.id}.html`), postHtml)
  })
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
  }
})()

import { readdir, readFile, writeFile } from 'fs/promises'
import yargs from 'yargs'
import markdownHtml from 'zenn-markdown-html'
import { getFullPath } from './lib/path'
import { getMetaData, getContent } from './lib/post'

import { Index } from './template/index'

const main = async () => {
  // argsを読み取り
  const args = yargs(process.argv)
  // postsのファイルパス一覧取得
  // TODO: エラーハンドリング
  const postNames = await readdir(getFullPath('../doc/posts/'))

  // postsの内容を取得
  const posts = await Promise.all(
    postNames.map(async (fileName) => {
      const post = await readFile(
        getFullPath('../doc/posts', fileName),
        'utf-8'
      )
      return {
        meta: { ...getMetaData(post), fileName },
        content: getContent(post),
      }
    })
  )

  // index.htmlを作成
  // テンプレート取得
  const indexTemplate = await readFile(
    getFullPath('./template/index.html'),
    'utf-8'
  )
  const postListDom = posts.map((post) => {
    return `<li><a href="./posts/${post.meta.fileName.replace('md', 'html')}">${
      post.meta.title
    }</a></li>`
  })
  // contentsをhtmlに変換
  const indexHtml = indexTemplate
    .replace('{title}', '投稿一覧')
    .replace('{body}', `<ul>${postListDom.join('')}</ul>`)

  // index.htmlを書き込み
  await writeFile(
    getFullPath('../dist/index.html'),
    Index({ title: '投稿一覧', children: `<ul>${postListDom}</ul>` })
  )

  // posts/${id}.htmlを作成
  const postTemplate = await readFile(
    getFullPath('./template/posts.html'),
    'utf-8'
  )
  posts.forEach(async (post) => {
    const contentHtml = markdownHtml(post.content)
    const postHtml = postTemplate
      .replace('{title}', post.meta.title)
      .replace('{body}', contentHtml)
    await writeFile(
      getFullPath(
        `../dist/posts/${post.meta.fileName.replace('.md', '')}.html`
      ),
      postHtml
    )
  })
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
  }
})()

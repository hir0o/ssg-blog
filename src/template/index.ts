import { PostListItem } from './postListItem'
import { Layout } from './layout'
import { Post } from '../types'

type Props = {
  title: string
  posts: Post[]
}

export const Index = ({ title, posts }: Props) => {
  return `
    ${Layout({
      children: `
        <h1>${title}</h1>
        <main>
            <ul>
                ${posts.map((post) => PostListItem({ post })).join('')}
            </ul>
        </main>
    `,
    })}
    `
}

import { Post } from '../types'

type Props = {
  post: Post
}

export const PostListItem = ({ post }: Props) => {
  return `<li><a href="./posts/${post.meta.id}">${post.meta.title}</a><li>`
}

import { Layout } from './layout'

type Props = {
  title: string
  children: string
}

export const Index = ({ title, children }: Props) => {
  return `
    ${Layout({
      children: `
        <h1>${title}</h1>
        <main>${children}</main>
    `,
    })}
    `
}

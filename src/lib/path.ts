import path from 'path'

export const getFullPath = (...relativePaths: string[]): string => {
  // lib/の分一階層上に
  return path.resolve(__dirname, '../', relativePaths.join('/'))
}

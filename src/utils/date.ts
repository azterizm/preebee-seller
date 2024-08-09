import RelativeTime from '@yaireo/relative-time'

export function getRelativeTime(arg: Date | string) {
  const r = new RelativeTime()
  return r.from(new Date(arg))
}

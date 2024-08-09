export function convertToNumber(arg: string | number, fallback?: number) {
  const result = Number(arg)
  if (isNaN(result)) return fallback || 0
  return result
}
export function handleStringNumber(value: any) {
  return !value
    ? 0
    : isNaN(parseInt(value.toString()))
    ? 0
    : parseInt(value.toString())
}

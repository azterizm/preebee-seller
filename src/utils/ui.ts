import _ from 'lodash'

export { twMerge as cn } from 'tailwind-merge'

export function formatCurrency(arg: number) {
  return 'Rs. ' + Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(arg)
}

interface AnyObject {
  [key: string]: string
}

export function combineObjects(arr: (AnyObject | string)[]): AnyObject {
  return arr.reduce((acc: AnyObject, item: AnyObject | string) => {
    if (typeof item === 'string') {
      acc[item] = ''
    } else {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          acc[key] = item[key]
        }
      }
    }
    return acc
  }, {})
}

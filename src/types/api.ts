import {
  ordersSortByKeys,
  pageNames,
  productsSortByKeys,
} from '../constants/api'

export type PageName = (typeof pageNames)[number]
export type DBResult<T extends (...args: any) => any> = Awaited<ReturnType<T>>
export type ProductsSortBy = typeof productsSortByKeys[number]
export type OrdersSortBy = typeof ordersSortByKeys[number]

export interface TableOptions {
  search: string
  sortBy: ProductsSortBy
}
export const tableOptionsSchema = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    sortBy: { type: 'string' },
  },
  required: ['search', 'sortBy'],
}

export interface AuthUser {
  id: string
  name: string
  profile: string
}

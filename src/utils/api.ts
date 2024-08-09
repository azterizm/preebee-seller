import _ from 'lodash'
import slugify from 'slugify'
import uniqid from 'uniqid'
import { ZodError } from 'zod'

export function convertMultipartFieldsToObject(fields: any) {
  const keys = Object.keys(fields)
  return _.zipObject(
    keys,
    keys.map((key) => fields[key].value),
  )
}

export function parseZodError(error: ZodError) {
  return error.issues[0].message + ': ' + error.issues[0].path[0]
}

export function generateProductId(title: string) {
  return uniqid(slugify(
    title,
    {
      lower: true,
      trim: true,
    },
  ))
}

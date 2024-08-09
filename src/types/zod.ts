import { z } from 'zod'

export const zodFileArray = z.array(
  z.object({
    filename: z.string(),
    data: z.instanceof(Buffer),
    encoding: z.string(),
    mimetype: z.string(),
  }),
)

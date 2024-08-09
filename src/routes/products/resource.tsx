import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify'
import {
  getProductImageById,
  getProductMainImageById,
} from '../../models/product'

export default function (
  app: FastifyInstance,
  _ops: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/image/:id/:productId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
          },
          required: ['id', 'productId'],
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: { id: string; productId: string } }>,
      res,
    ) => {
      const image = await getProductImageById(
        req.params.id,
        req.params.productId,
      )
      if (!image) return res.status(404)
      res.header('Content-Length', image.data.length)
      res.type('image/webp')
      res.send(image.data)
      return
    },
  )
  app.get(
    '/main_image/:productId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
          required: ['productId'],
        },
      },
    },
    async (req: FastifyRequest<{ Params: { productId: string } }>, res) => {
      const user = req.user
      const image = await getProductMainImageById(
        req.params.productId,
        user?.id!,
      )
      if (!image) return res.status(404)
      res.header('Content-Length', image.mainImage.length)
      res.type('image/webp')
      res.send(image.mainImage)
      return
    },
  )

  done()
}

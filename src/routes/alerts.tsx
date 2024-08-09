import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import AlertPing from '../components/AlertPing'
import { redis } from '../config/db'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get<{
    Params: { feature: string }
  }>('/:feature', {
    schema: {
      response: {
        200: {
          type: 'string',
        },
      },
      params: {
        type: 'object',
        properties: {
          feature: {
            type: 'string',
          },
        },
        required: ['feature'],
      },
    },
  }, async (req, res) => {
    const user = req.user!
    const exists = await redis.sismember(
      'alerts:' + user.id,
      req.params.feature,
    )
    return res.type('text/html').send(
      exists ? <AlertPing /> : null,
    )
  })

  done()
}

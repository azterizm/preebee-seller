import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { prisma, redis } from '../config/db'
import { formatCurrency } from '../utils/ui'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get<{
    Querystring: { force?: string }
  }>('/', {
    schema: {
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const user = req.user!
    const force = req.query.force === '1'
    const cached = await redis.get(`seller:${user.id}:earnings`)
    if (cached && !force) {
      return res.type('text/html').send(
        formatCurrency(Number(cached)),
      )
    }
    const userInstance = await prisma.seller.findUnique({
      where: { id: user.id },
      select: { earnings: true },
    })
    const earnings = userInstance!.earnings
    await redis.setex(
      `seller:${user.id}:earnings`,
      60 * 60 * 24,
      String(earnings),
    )
    return res.type('text/html').send(
      formatCurrency(earnings),
    )
  })

  done()
}

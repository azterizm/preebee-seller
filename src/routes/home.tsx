import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import { prisma } from '../config/db'

//handle onboarding status as middleware
export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/',
    { schema: { response: { 200: { type: 'string' } } } },
    async (req, res) => {
      const user = req.user
      const instance = !user ? null : await prisma.seller.findFirst({
        where: {
          id: user.id,
        },
        select: {
          status: true,
        },
      })
      if (instance?.status === 'Onboard') return res.redirect('/onboarding')
      return res
        .type('text/html')
        .send(user ? <Dashboard user={user} /> : <Home />)
    },
  )

  app.get('/dashboard', (_, res) => res.redirect('/'))
  done()
}

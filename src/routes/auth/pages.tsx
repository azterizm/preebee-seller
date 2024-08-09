import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Login from '../../pages/auth/Login'
import { logoutUser } from '../../middlewares/auth'

export default function(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/login',
    { schema: { response: { 200: { type: 'string' } } } },
    async (_, res) => {
      return res.type('text/html').send(<Login />)
    },
  )
  app.get(
    '/logout',
    { schema: { response: { 200: { type: 'string' } } } },
    async (req, res) => {
      logoutUser(req)
      return res.redirect('/login')
    },
  )

  done()
}
